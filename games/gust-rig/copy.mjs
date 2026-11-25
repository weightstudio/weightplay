export const routeLanguages = {
  en: 'en', 'zh-tw': 'zh-Hant', 'zh-cn': 'zh-Hans', ja: 'ja', ko: 'ko', es: 'es',
  'pt-br': 'pt-BR', fr: 'fr', de: 'de', it: 'it', ru: 'ru', hi: 'hi', ar: 'ar'
};

export const english = {
  title: 'Gust Rig', type: 'Balance Puzzle', summary: 'Adjust two winches to guide a festival balloon through changing wind and gate shapes.',
  play: 'Start', stage: 'Route', stages: 'Routes', tools: 'Rig workshop', guide: 'Game guide', back: 'Back', menu: 'Pause',
  goal: 'Goal', how: 'How to play', controls: 'Controls and rules', finishing: 'Finishing the route', faq: 'FAQ', related: 'Related games',
  instruction: 'Select a winch change to preview it. Confirm to move the balloon through this gate.',
  formulas: 'Reeling in raises the balloon. Pulling harder on one side tilts it toward that side. The arrow shows the wind’s extra tilt.',
  scoring: 'Clear every gate and collect every paired ribbon for three stars. Undo or retry to improve your route.',
  q1: 'How do the ribbons work?', a1: 'Pass both marked gates in a row. If you miss the first one, undo before attempting the second.',
  q2: 'Do I need to buy any tools?', a2: 'Every route can earn three stars with the basic winches. The workshop gives you extra ways to solve a gate.',
  leftUp: 'Reel left', rightUp: 'Reel right', leftDown: 'Ease left', rightDown: 'Ease right', hold: 'Hold',
  togetherUp: 'Reel both', togetherDown: 'Ease both', leanLeft: 'Shift left', leanRight: 'Shift right', calm: 'Dampen wind',
  wind: 'Wind', height: 'Height', tilt: 'Tilt', left: 'Left', right: 'Right', still: 'Calm', gate: 'Gate', locked: 'Locked',
  ribbon: 'Ribbon pair', hard: 'Must pass', centered: 'Inside the gate', low: 'Too low', high: 'Too high', side: 'Tilt outside the gate',
  missedRibbon: 'Missed the first ribbon', unavailable: 'Unavailable', endOfRope: 'Winch at its limit', choose: 'Choose a winch change.',
  send: 'Pass gate', undo: 'Undo', retry: 'Retry', next: 'Next route', ready: 'Ready', cleared: 'Cleared', won: 'Route cleared',
  lost: 'Route interrupted', saved: 'Progress saved', saveFailed: 'Save unavailable. Try again.', close: 'Close',
  tandem: 'Coupled reels', trim: 'Differential', damper: 'Gust damper', basic: 'Basic rig',
  tandemInfo: 'Once per route, reel or ease both ropes together.', trimInfo: 'Once per route, shift tilt without changing height.',
  damperInfo: 'Cancel the wind on one gate while holding both ropes steady.', bronze: 'Bronze sash',
  bronzeInfo: 'A permanent sash for the moth balloon.', cost: 'diamonds', buy: 'Buy', equip: 'Equip', equipped: 'Equipped',
  shortage: 'Not enough diamonds', lesson: 'Raise the balloon one level. Choose either reel, then pass the gate.',
  practice: 'Replay lesson', renderError: 'The 3D scene is unavailable.', recovering: 'Waiting for the 3D scene to recover.',
  passed: 'Gate cleared', missed: 'Gate missed', restored: 'Previous gate restored', nextWind: 'Next wind', preview: 'Preview',
  eventTitle: 'Gusts draw attention before a milestone parade',
  eventLead: 'New York scheduled a public balloon inflation for November 25, 2026, ahead of its 100th Thanksgiving Day Parade the next day.',
  eventFact: 'Ahead of the parade, forecasts put attention on whether strong winds would affect the giant balloons. The decision was still pending during preparations.',
  eventFiction: 'In the fictional festival of Gust Rig, predict the next gust and balance two winches to thread a moth balloon through town gates.'
};

const traditional = {
  title: '風幕雙索', type: '平衡益智', summary: '調整兩具絞盤，讓慶典氣球迎著側風穿過不同門框。',
  play: '開始', stage: '路段', stages: '關卡', tools: '絞盤工坊', guide: '遊戲指南', back: '返回', menu: '暫停',
  goal: '目標', how: '玩法', controls: '操作與規則', finishing: '如何過關', faq: '常見問題', related: '相關遊戲',
  instruction: '選擇一種絞盤操作，查看氣球會移到哪裡。確認後就會通過這道門。',
  formulas: '收索會升高氣球。哪一側收得多，氣球就向哪一側傾；風向箭頭提示偏斜還會怎麼變。',
  scoring: '穿過每道門並收好所有成對飄帶即可拿到三星。也可撤回或重試，找出更好的走法。',
  q1: '成對飄帶怎麼拿？', a1: '連續通過兩道有飄帶的門。若錯過第一道，先撤回再試。',
  q2: '需要購買工具才能過關嗎？', a2: '基礎絞盤就能拿到每關三星。工坊工具讓你多一種解法。',
  leftUp: '收左索', rightUp: '收右索', leftDown: '放左索', rightDown: '放右索', hold: '保持',
  togetherUp: '一起收', togetherDown: '一起放', leanLeft: '偏向左', leanRight: '偏向右', calm: '緩陣',
  wind: '風向', height: '高度', tilt: '偏斜', left: '左', right: '右', still: '無風', gate: '門框', locked: '鎖定',
  ribbon: '飄帶成對', hard: '必過', centered: '對準門框', low: '高度太低', high: '高度太高', side: '偏斜超出門框',
  missedRibbon: '漏掉第一道飄帶', unavailable: '目前無法使用', endOfRope: '絞盤已到極限', choose: '選擇一種絞盤操作。',
  send: '穿門', undo: '撤回', retry: '重試', next: '下一關', ready: '可遊玩', cleared: '已通關', won: '順利穿門',
  lost: '路線中斷', saved: '進度已保存', saveFailed: '進度未能保存，請再試。', close: '關閉',
  tandem: '並動絞盤', trim: '差動齒輪', damper: '緩陣扣', basic: '基礎絞盤',
  tandemInfo: '每關一次，同時收或放兩側索。', trimInfo: '每關一次，保持高度並改變偏斜。',
  damperInfo: '兩索不動，抵消一扇門的風偏。', bronze: '青銅飾帶', bronzeInfo: '為飛蛾氣球換上永久青銅飾帶。',
  cost: '鑽石', buy: '購買', equip: '裝配', equipped: '已裝配', shortage: '鑽石不足',
  lesson: '將氣球升高一格。點任一側收索，再點「穿門」。',
  practice: '重玩教學', renderError: '無法顯示立體場景。', recovering: '等待立體場景恢復。',
  passed: '順利通過', missed: '穿門失誤', restored: '已撤回上一步', nextWind: '下道門風向', preview: '預覽',
  eventTitle: '百屆遊行籌備中，氣球升空得看風勢',
  eventLead: '紐約安排於 2026 年 11 月 25 日公開展示氣球充氣，為隔天第 100 屆感恩節遊行暖場。',
  eventFact: '遊行前的強風預報引起關注。籌備期間，巨型氣球的升空安排仍待決定。',
  eventFiction: '《風幕雙索》把這個取捨改編成虛構小鎮的慶典。玩家要預判側風、平衡兩具絞盤，帶飛蛾氣球穿過不同門框。'
};

export const copies = { en: english, 'zh-Hant': traditional };

export function getCopy(language) {
  return copies[language] || english;
}

const keys = [
  'play stage stages tools guide back menu goal how controls finishing faq related',
  'leftUp rightUp leftDown rightDown hold togetherUp togetherDown leanLeft leanRight calm',
  'wind height tilt left right still gate locked ribbon hard centered low high side missedRibbon unavailable endOfRope choose',
  'send undo retry next ready cleared won lost saved saveFailed close tandem trim damper basic bronze cost buy equip equipped shortage',
  'practice renderError recovering passed missed restored nextWind preview',
  'instruction formulas scoring q1 a1 q2 a2 tandemInfo trimInfo damperInfo bronzeInfo lesson',
  'eventTitle eventLead eventFact eventFiction'
];

function install(language, title, type, summary, groups) {
  const copy = { title, type, summary };
  for (const [index, names] of keys.entries()) {
    const words = groups[index].split('|');
    const namesList = names.split(' ');
    if (words.length !== namesList.length || words.some(word => !word.trim())) {
      throw new Error('Incomplete Gust Rig language group ' + language + ' / ' + (index + 1));
    }
    for (const [position, key] of namesList.entries()) copy[key] = words[position];
  }
  copies[language] = copy;
}

install('zh-Hans', '风幕双索', '平衡益智', '调整两具绞盘，让庆典气球迎着侧风穿过不同门框。', [
  '开始|路段|关卡|绞盘工坊|游戏指南|返回|暂停|目标|玩法|操作与规则|如何通关|常见问题|相关游戏',
  '收左索|收右索|放左索|放右索|保持|一起收|一起放|偏向左|偏向右|缓阵',
  '风向|高度|倾斜|左|右|无风|门框|锁定|飘带成对|必过|对准门框|高度太低|高度太高|倾斜超出门框|漏掉第一道飘带|目前不能使用|绞盘已到极限|选择一种绞盘操作。',
  '穿门|撤回|重试|下一关|可游玩|已通关|顺利穿门|路线中断|进度已保存|进度未能保存，请再试。|关闭|并动绞盘|差动齿轮|缓阵扣|基础绞盘|青铜饰带|钻石|购买|装配|已装配|钻石不足',
  '重玩教学|无法显示立体场景。|等待立体场景恢复。|顺利通过|穿门失误|已撤回上一步|下道门风向|预览',
  '选择一种绞盘操作，查看气球会移到哪里。确认后就会尝试穿门。|收索会升高气球。哪一侧收得多，气球就向哪一侧倾。风向箭头提示倾斜变化。|穿过每道门并收好所有成对飘带即可拿到三星。也能撤回或重试。|成对飘带怎么拿？|连续通过两道有飘带的门。错过第一道后可以撤回再试。|要购买工具才能通关吗？|基础绞盘就能拿到每关三星。工坊工具会增加解法。|每关一次，同时收或放两侧索。|每关一次，保持高度并改变倾斜。|两索不动，抵消一道门的风偏。|为飞蛾气球换上永久青铜饰带。|将气球升高一格。点任一侧收索，再点穿门。',
  '百届游行筹备中，气球升空要看风势|纽约安排于2026年11月25日公开展示气球充气，为次日第100届感恩节游行暖场。|游行前的强风预报引起关注。筹备期间，巨型气球的升空安排仍待决定。|《风幕双索》把这个取舍改编成虚构小镇的庆典。预判侧风、平衡绞盘，带飞蛾气球穿过不同门框。'
]);

install('ja', '風幕の二本綱', 'バランスパズル', '二つの巻き上げ機を調整し、横風の中で祭りの気球を門に通そう。', [
  '開始|ルート|ルート一覧|整備工房|遊び方ガイド|戻る|一時停止|目標|遊び方|操作とルール|クリア条件|よくある質問|関連ゲーム',
  '左を巻く|右を巻く|左を緩める|右を緩める|そのまま|両方巻く|両方緩める|左へ傾ける|右へ傾ける|風を抑える',
  '風|高さ|傾き|左|右|無風|門|固定|対のリボン|通過必須|門に収まる|低すぎる|高すぎる|傾きが範囲外|最初のリボンを逃した|使えません|巻き取り限界|綱の操作を選ぼう。',
  '門を通る|一手戻る|やり直す|次のルート|挑戦可能|クリア済み|ルート成功|ルート中断|進行を保存しました|保存できません。もう一度お試しください。|閉じる|連動リール|差動ギア|防風留め具|基本装備|青銅の帯|ダイヤ|購入|装着|装着済み|ダイヤ不足',
  '練習をやり直す|3D画面を表示できません。|3D画面の復帰を待っています。|通過成功|通過失敗|前の門に戻りました|次の風|予測',
  '綱の操作を選ぶと結果が見えます。確定して気球を門に通します。|綱を巻くと上昇します。多く巻く側に傾き、矢印の風がさらに傾きを変えます。|全ての門と対のリボンを揃えると星3つです。一手戻るかやり直せます。|対のリボンはどう取る？|印のある二つの門を続けて通ります。一つ目を逃したら操作を戻せます。|道具は購入必須ですか？|全ルートで基本装備だけでも星3つを獲得できます。工房の道具は別の解き方を増やします。|毎ルート一度、両方の綱を同時に操作できます。|毎ルート一度、高さを保ったまま傾きを変えます。|綱を固定し、一つの門で風の影響を打ち消します。|蛾の気球に青銅色の帯を付けます。|気球を一段上げます。片側を巻いてから「門を通る」を選びます。',
  '記念パレードを前に注目された強風|ニューヨークでは2026年11月25日に気球の公開膨張が予定され、翌日は100回目の感謝祭パレードです。|強風の予報で巨大気球の運用に関心が集まりました。準備の段階では飛行の判断はまだ出ていませんでした。|架空の祭りを舞台に、二本の綱で蛾の気球を操り、横風を読んで門を通します。'
]);

install('ko', '바람막이 두 줄', '균형 퍼즐', '두 윈치를 조절해 옆바람을 가르며 축제 풍선을 문으로 통과시키세요.', [
  '시작|길|길 목록|윈치 공방|게임 안내|뒤로|일시정지|목표|플레이 방법|조작과 규칙|완료 조건|자주 묻는 질문|관련 게임',
  '왼쪽 감기|오른쪽 감기|왼쪽 풀기|오른쪽 풀기|유지|둘 다 감기|둘 다 풀기|왼쪽 기울임|오른쪽 기울임|바람 완화',
  '바람|높이|기울기|왼쪽|오른쪽|없음|문|잠김|한 쌍의 리본|필수 통과|문에 맞음|너무 낮음|너무 높음|기울기 범위 초과|첫 리본을 놓침|사용할 수 없음|윈치 한계|윈치 조작을 고르세요.',
  '문 통과|되돌리기|다시 시도|다음 길|준비됨|완료|길 통과|길 중단|진행 저장됨|저장할 수 없습니다. 다시 시도하세요.|닫기|연동 윈치|차동 기어|바람 완충기|기본 윈치|청동 띠|다이아몬드|구매|장착|장착됨|다이아몬드 부족',
  '교습 다시 하기|3D 장면을 표시할 수 없습니다.|3D 장면이 복원되기를 기다립니다.|통과 성공|통과 실패|이전 문으로 돌아감|다음 바람|예상',
  '윈치 조작을 선택해 결과를 미리 보세요. 확인하면 풍선이 문을 향해 움직입니다.|줄을 감으면 풍선이 올라갑니다. 더 감긴 쪽으로 기울고 화살표의 바람이 기울기에 영향을 줍니다.|모든 문을 통과하고 리본 쌍을 모으면 별 세 개를 얻습니다. 되돌리거나 다시 시도할 수 있습니다.|리본을 어떻게 모으나요?|표시된 두 문을 연달아 통과하세요. 첫 문을 놓쳤다면 되돌릴 수 있습니다.|도구를 사야 하나요?|기본 윈치로 모든 길에서 별 세 개를 얻을 수 있습니다. 공방 도구는 다른 풀이를 추가합니다.|길마다 한 번, 두 줄을 동시에 감거나 풉니다.|길마다 한 번, 높이를 유지하며 기울기를 바꿉니다.|두 줄을 그대로 두고 한 문에서 바람을 상쇄합니다.|나방 풍선에 영구 청동 띠를 달아 줍니다.|풍선을 한 칸 올리세요. 한쪽을 감은 뒤 문을 통과하세요.',
  '기념 퍼레이드를 앞두고 강풍에 관심|뉴욕은 2026년 11월 25일 공개 풍선 부풀리기를 예정했습니다. 다음 날은 제100회 추수감사절 퍼레이드입니다.|강풍 예보로 대형 풍선이 뜰 수 있을지 주목받았습니다. 준비 단계에서 비행 여부는 결정되지 않았습니다.|가상의 축제에서 옆바람을 읽고 두 윈치의 균형을 맞춰 나방 풍선을 문 사이로 안내합니다.'
]);

install('es', 'Dos Cabos al Viento', 'Puzle de equilibrio', 'Ajusta dos tornos y guía el globo del festival entre arcos y ráfagas.', [
  'Empezar|Ruta|Rutas|Taller de tornos|Guía del juego|Atrás|Pausa|Objetivo|Cómo jugar|Controles y reglas|Cómo terminar|Preguntas frecuentes|Juegos relacionados',
  'Tensa izq.|Tensa der.|Suelta izq.|Suelta der.|Mantén|Tensa ambos|Suelta ambos|Inclina a la izq.|Inclina a la der.|Amortigua',
  'Viento|Altura|Inclinación|Izquierda|Derecha|Calma|Arco|Bloqueado|Par de cintas|Obligatorio|Cabe en el arco|Demasiado bajo|Demasiado alto|Inclinación fuera del arco|Falta la primera cinta|No disponible|Torno al límite|Elige un ajuste.',
  'Cruzar arco|Deshacer|Reintentar|Siguiente ruta|Disponible|Superada|Ruta superada|Ruta interrumpida|Progreso guardado|No se pudo guardar. Inténtalo de nuevo.|Cerrar|Tornos acoplados|Diferencial|Amortiguador|Tornos básicos|Banda de bronce|diamantes|Comprar|Equipar|Equipado|Faltan diamantes',
  'Repetir tutorial|La escena 3D no está disponible.|Esperando a que vuelva la escena 3D.|Arco superado|Arco fallado|Arco anterior restaurado|Próximo viento|Vista previa',
  'Elige un ajuste y mira su resultado previsto. Confirma para guiar el globo por el arco.|Al tensar sube el globo. Tira más de un lado y se inclinará hacia él. La flecha muestra el efecto del viento.|Pasa todos los arcos y recoge cada par de cintas para ganar tres estrellas. Puedes deshacer o volver a empezar.|¿Cómo consigo las cintas?|Cruza seguidos los dos arcos marcados. Si fallas el primero, deshaz el paso.|¿Tengo que comprar herramientas?|Puedes ganar tres estrellas en todas las rutas con los tornos básicos. Las herramientas aportan soluciones distintas.|Tensa o suelta ambos cabos juntos una vez por ruta.|Cambia la inclinación sin variar la altura una vez por ruta.|Anula el viento en un arco sin mover los cabos.|Una banda permanente para el globo polilla.|Sube el globo un nivel. Tensa un cabo y cruza el arco.',
  'Las ráfagas llaman la atención antes de un desfile histórico|Nueva York programó el inflado público de globos para el 25 de noviembre de 2026. El centésimo desfile de Acción de Gracias estaba previsto para el día siguiente.|La previsión de fuertes vientos puso el foco en los globos gigantes. Durante los preparativos, su vuelo seguía pendiente.|En un festival ficticio, anticipa el viento y equilibra los tornos para guiar un globo polilla entre los arcos.'
]);

install('pt-BR', 'Cabos ao Vento', 'Quebra-cabeça de equilíbrio', 'Ajuste dois guinchos e guie o balão da festa entre pórticos e rajadas.', [
  'Começar|Rota|Rotas|Oficina de guinchos|Guia do jogo|Voltar|Pausar|Objetivo|Como jogar|Controles e regras|Como concluir|Perguntas frequentes|Jogos relacionados',
  'Puxe à esq.|Puxe à dir.|Solte à esq.|Solte à dir.|Mantenha|Puxe ambos|Solte ambos|Incline à esq.|Incline à dir.|Amenize o vento',
  'Vento|Altura|Inclinação|Esquerda|Direita|Calmaria|Pórtico|Travado|Par de fitas|Obrigatório|Dentro do pórtico|Muito baixo|Muito alto|Inclinação fora do pórtico|A primeira fita ficou para trás|Indisponível|Guincho no limite|Escolha um ajuste.',
  'Cruzar pórtico|Desfazer|Tentar de novo|Próxima rota|Disponível|Concluída|Rota concluída|Rota interrompida|Progresso salvo|Não foi possível salvar. Tente novamente.|Fechar|Guinchos acoplados|Diferencial|Amortecedor|Guinchos básicos|Faixa de bronze|diamantes|Comprar|Equipar|Equipado|Faltam diamantes',
  'Repetir tutorial|A cena 3D está indisponível.|Aguardando a recuperação da cena 3D.|Pórtico cruzado|Pórtico perdido|Pórtico anterior restaurado|Próximo vento|Prévia',
  'Escolha um ajuste para ver a previsão. Confirme para guiar o balão pelo pórtico.|Recolher a corda eleva o balão. Ele se inclina para o lado mais recolhido. A seta mostra o efeito do vento.|Cruze todos os pórticos e recolha os pares de fitas para ganhar três estrelas. Desfaça ou tente de novo.|Como pego as fitas?|Cruze os dois pórticos marcados em sequência. Se errar o primeiro, desfaça a jogada.|Preciso comprar ferramentas?|Os guinchos básicos permitem três estrelas em todas as rotas. A oficina oferece outras soluções.|Recolhe ou solta as duas cordas juntas uma vez por rota.|Muda a inclinação sem mexer na altura uma vez por rota.|Anula o vento de um pórtico sem mover as cordas.|Uma faixa permanente para o balão mariposa.|Eleve o balão um nível. Recolha uma corda e cruze o pórtico.',
  'Rajadas chamam atenção antes de um desfile histórico|Nova York marcou a apresentação pública do enchimento dos balões para 25 de novembro de 2026, antes do centésimo desfile de Ação de Graças no dia seguinte.|A previsão de vento forte levantou dúvidas sobre os balões gigantes. Durante os preparativos ainda não havia decisão sobre o voo.|Na festa fictícia do jogo, antecipe as rajadas e equilibre os guinchos para guiar o balão mariposa pelos pórticos.'
]);

install('fr', 'Cordes au Vent', 'Puzzle d’équilibre', 'Ajustez deux treuils pour guider le ballon du festival sous les arches malgré les rafales.', [
  'Jouer|Parcours|Parcours|Atelier des treuils|Guide du jeu|Retour|Pause|Objectif|Comment jouer|Commandes et règles|Terminer le parcours|Questions fréquentes|Jeux associés',
  'Tendre à g.|Tendre à d.|Lâcher à g.|Lâcher à d.|Maintenir|Tendre les deux|Lâcher les deux|Pencher à g.|Pencher à d.|Amortir le vent',
  'Vent|Hauteur|Inclinaison|Gauche|Droite|Calme|Arche|Bloqué|Paire de rubans|Passage obligatoire|Dans l’arche|Trop bas|Trop haut|Inclinaison hors de l’arche|Premier ruban manqué|Indisponible|Treuil en butée|Choisissez un réglage.',
  'Franchir|Annuler|Réessayer|Parcours suivant|Prêt|Terminé|Parcours réussi|Parcours interrompu|Progression enregistrée|Échec de la sauvegarde. Réessayez.|Fermer|Treuils couplés|Différentiel|Amortisseur|Treuils de base|Bande de bronze|diamants|Acheter|Équiper|Équipé|Diamants insuffisants',
  'Rejouer le tutoriel|La scène 3D est indisponible.|En attente du rétablissement de la scène 3D.|Arche franchie|Arche manquée|Retour à l’arche précédente|Prochain vent|Aperçu',
  'Choisissez un réglage pour voir son effet. Confirmez pour guider le ballon dans l’arche.|Enrouler une corde élève le ballon. Il penche du côté le plus tendu et la flèche indique l’effet du vent.|Franchissez toutes les arches et prenez chaque paire de rubans pour obtenir trois étoiles. Annulez un coup ou recommencez.|Comment prendre les rubans ?|Franchissez les deux arches marquées à la suite. En cas d’erreur sur la première, revenez en arrière.|Faut-il acheter des outils ?|Les treuils de base suffisent pour obtenir trois étoiles partout. Les outils ouvrent d’autres solutions.|Enroule ou relâche les deux cordes ensemble une fois par parcours.|Change l’inclinaison sans modifier la hauteur une fois par parcours.|Annule le vent sous une arche en gardant les cordes fixes.|Une bande permanente pour le ballon papillon de nuit.|Montez d’un niveau. Tendez un côté puis franchissez l’arche.',
  'Les rafales retiennent l’attention avant un défilé historique|New York avait prévu un gonflage public des ballons le 25 novembre 2026, à la veille de son centième défilé de Thanksgiving.|Les prévisions de vent fort soulevaient des questions sur les ballons géants. Leur envol restait à décider pendant les préparatifs.|Dans la fête fictive du jeu, anticipez les rafales et ajustez deux treuils pour faire passer un ballon papillon sous les arches.'
]);

install('de', 'Doppelseil im Wind', 'Balance-Rätsel', 'Führe den Festballon mit zwei Winden durch Böen und wechselnde Tore.', [
  'Start|Strecke|Strecken|Windenwerkstatt|Spielanleitung|Zurück|Pause|Ziel|Spielablauf|Steuerung und Regeln|Streckenabschluss|Häufige Fragen|Ähnliche Spiele',
  'Links einholen|Rechts einholen|Links lösen|Rechts lösen|Halten|Beide einholen|Beide lösen|Nach links neigen|Nach rechts neigen|Wind dämpfen',
  'Wind|Höhe|Neigung|Links|Rechts|Windstill|Tor|Gesperrt|Bandpaar|Pflichttor|Passt durchs Tor|Zu niedrig|Zu hoch|Neigung außerhalb des Tors|Erstes Band verpasst|Nicht verfügbar|Winde am Anschlag|Wähle eine Windeneinstellung.',
  'Tor passieren|Rückgängig|Erneut versuchen|Nächste Strecke|Bereit|Abgeschlossen|Strecke geschafft|Strecke abgebrochen|Fortschritt gespeichert|Speichern fehlgeschlagen. Versuche es erneut.|Schließen|Gekoppelte Winden|Differential|Winddämpfer|Grundausrüstung|Bronzeschärpe|Diamanten|Kaufen|Ausrüsten|Ausgerüstet|Nicht genug Diamanten',
  'Einführung wiederholen|Die 3D-Szene ist nicht verfügbar.|Warte auf die Wiederherstellung der 3D-Szene.|Tor passiert|Tor verfehlt|Vorheriges Tor wiederhergestellt|Nächster Wind|Vorschau',
  'Wähle eine Änderung und sieh dir die Vorschau an. Bestätige, um den Ballon durchs Tor zu führen.|Beim Einholen steigt der Ballon. Er neigt sich zur stärker eingeholten Seite. Der Pfeil zeigt den Windeinfluss.|Passiere alle Tore und sammle jedes Bandpaar für drei Sterne. Gehe einen Zug zurück oder versuche es erneut.|Wie sammle ich die Bänder?|Passiere beide markierten Tore nacheinander. Beim ersten Fehler kannst du zurückgehen.|Muss ich Werkzeuge kaufen?|Mit der Grundausrüstung schaffst du überall drei Sterne. Die Werkstatt eröffnet weitere Lösungen.|Hole beide Seile einmal pro Strecke gemeinsam ein oder löse sie.|Ändere die Neigung einmal pro Strecke bei gleicher Höhe.|Gleicht den Wind an einem Tor aus, während beide Seile fest bleiben.|Eine dauerhafte Bronzeschärpe für den Mottenballon.|Hebe den Ballon eine Stufe an. Hole ein Seil ein und passiere das Tor.',
  'Böen rücken vor dem Jubiläumsumzug in den Fokus|New York plante für den 25. November 2026 das öffentliche Aufblasen der Ballons. Am nächsten Tag sollte die hundertste Thanksgiving-Parade stattfinden.|Die Prognose mit starken Böen warf Fragen zu den Riesenballons auf. Während der Vorbereitungen stand die Entscheidung über ihren Einsatz noch aus.|Beim erfundenen Fest liest du die Böen und steuerst mit zwei Winden einen Mottenballon durch die Tore.'
]);

install('it', 'Corde al Vento', 'Puzzle di equilibrio', 'Regola due argani e guida il pallone della festa tra archi e raffiche.', [
  'Inizia|Percorso|Percorsi|Officina degli argani|Guida al gioco|Indietro|Pausa|Obiettivo|Come giocare|Comandi e regole|Come terminare|Domande frequenti|Giochi correlati',
  'Avvolgi a sx|Avvolgi a dx|Allenta a sx|Allenta a dx|Mantieni|Avvolgi entrambi|Allenta entrambi|Inclina a sx|Inclina a dx|Smorza il vento',
  'Vento|Altezza|Inclinazione|Sinistra|Destra|Calma|Arco|Bloccato|Coppia di nastri|Passaggio obbligato|Dentro l’arco|Troppo basso|Troppo alto|Inclinazione fuori dall’arco|Primo nastro mancato|Non disponibile|Argano al limite|Scegli una regolazione.',
  'Attraversa|Annulla|Riprova|Prossimo percorso|Disponibile|Completato|Percorso completato|Percorso interrotto|Progressi salvati|Salvataggio non riuscito. Riprova.|Chiudi|Argani accoppiati|Differenziale|Smorzatore|Argani di base|Fascia di bronzo|diamanti|Compra|Equipaggia|Equipaggiato|Diamanti insufficienti',
  'Rigioca il tutorial|La scena 3D non è disponibile.|In attesa del ripristino della scena 3D.|Arco superato|Arco mancato|Ripristinato l’arco precedente|Prossimo vento|Anteprima',
  'Scegli una regolazione per vederne l’effetto. Conferma per guidare il pallone nell’arco.|Avvolgere una corda alza il pallone. Il pallone si inclina verso il lato più avvolto. La freccia indica l’effetto del vento.|Supera tutti gli archi e raccogli ogni coppia di nastri per tre stelle. Puoi annullare o riprovare.|Come si raccolgono i nastri?|Attraversa i due archi contrassegnati di seguito. Se manchi il primo, annulla la mossa.|Devo comprare attrezzi?|Con gli argani di base puoi ottenere tre stelle in ogni percorso. Gli attrezzi offrono altre soluzioni.|Avvolgi o allenta insieme le corde una volta per percorso.|Cambia inclinazione senza cambiare altezza una volta per percorso.|Annulla il vento su un arco mantenendo ferme le corde.|Una fascia permanente per il pallone falena.|Alza il pallone di un livello. Avvolgi una corda e attraversa l’arco.',
  'Le raffiche attirano l’attenzione prima della parata storica|New York ha programmato il gonfiaggio pubblico dei palloni il 25 novembre 2026, prima della centesima parata del Ringraziamento prevista l’indomani.|Le previsioni di venti forti hanno sollevato dubbi sui palloni giganti. Durante i preparativi la decisione sul volo era ancora in sospeso.|Nella festa immaginaria del gioco, anticipa le raffiche e bilancia due argani per far passare un pallone falena sotto gli archi.'
]);

install('ru', 'Два троса на ветру', 'Головоломка на баланс', 'Управляйте двумя лебёдками и ведите праздничный шар через арки и порывы ветра.', [
  'Начать|Маршрут|Маршруты|Мастерская|Руководство|Назад|Пауза|Цель|Как играть|Управление и правила|Завершение маршрута|Частые вопросы|Похожие игры',
  'Тянуть слева|Тянуть справа|Ослабить слева|Ослабить справа|Удержать|Подтянуть оба|Ослабить оба|Наклонить влево|Наклонить вправо|Ослабить ветер',
  'Ветер|Высота|Наклон|Лево|Право|Штиль|Арка|Заблокировано|Пара лент|Обязательный проход|Шар проходит|Слишком низко|Слишком высоко|Наклон вне арки|Пропущена первая лента|Недоступно|Лебёдка на пределе|Выберите действие.',
  'Пройти арку|Отменить|Повторить|Следующий маршрут|Доступно|Пройдено|Маршрут пройден|Маршрут прерван|Прогресс сохранён|Не удалось сохранить. Попробуйте ещё раз.|Закрыть|Спаренные лебёдки|Дифференциал|Гаситель ветра|Основные лебёдки|Бронзовая лента|алмазы|Купить|Установить|Установлено|Недостаточно алмазов',
  'Повторить обучение|Трёхмерная сцена недоступна.|Ожидание восстановления сцены.|Арка пройдена|Промах у арки|Возврат к предыдущей арке|Следующий ветер|Прогноз',
  'Выберите настройку для предпросмотра. Подтвердите, чтобы провести шар через арку.|Подтягивание поднимает шар. Он наклоняется к более тугому тросу. Стрелка показывает влияние ветра.|Пройдите все арки и соберите все пары лент для трёх звёзд. Можно отменить ход или начать сначала.|Как собрать ленты?|Пройдите подряд две отмеченные арки. Если пропустили первую, отмените ход.|Нужно ли покупать инструменты?|Основных лебёдок достаточно для трёх звёзд на каждом маршруте. Инструменты добавляют другие решения.|Один раз за маршрут подтягивает или ослабляет оба троса вместе.|Один раз за маршрут меняет наклон без изменения высоты.|Гасит ветер у одной арки, сохраняя длину тросов.|Постоянная бронзовая лента для шара-мотылька.|Поднимите шар на один уровень. Подтяните один трос и пройдите арку.',
  'Порывы ветра привлекли внимание перед юбилейным парадом|В Нью-Йорке публичное надувание шаров было запланировано на 25 ноября 2026 года. Сотый парад в День благодарения намечен на следующий день.|Прогноз сильного ветра вызвал вопросы о гигантских шарах. Во время подготовки решение об их полёте ещё не было принято.|На вымышленном празднике учитывайте порывы и управляйте двумя лебёдками, чтобы провести шар-мотылёк через арки.'
]);

install('hi', 'हवा की दो रस्सियाँ', 'संतुलन पहेली', 'दो चरखियाँ चलाकर मेले के गुब्बारे को अलग-अलग मेहराबों और हवा के झोंकों से निकालें।', [
  'शुरू करें|मार्ग|मार्ग सूची|चरखी कार्यशाला|खेल गाइड|वापस|रोकें|लक्ष्य|कैसे खेलें|नियंत्रण और नियम|मार्ग पूरा करना|सामान्य प्रश्न|संबंधित खेल',
  'बाएँ खींचें|दाएँ खींचें|बाएँ ढीला|दाएँ ढीला|स्थिर रखें|दोनों खींचें|दोनों ढीली करें|बाएँ झुकाएँ|दाएँ झुकाएँ|झोंका थामें',
  'हवा|ऊँचाई|झुकाव|बायाँ|दायाँ|शांत|मेहराब|बंद|रिबन का जोड़ा|ज़रूरी पार|मेहराब के अंदर|बहुत नीचे|बहुत ऊपर|झुकाव बाहर|पहला रिबन छूटा|उपलब्ध नहीं|चरखी अपनी सीमा पर है|चरखी का बदलाव चुनें।',
  'पार करें|वापस लें|फिर कोशिश|अगला मार्ग|तैयार|पूरा|मार्ग पूरा|मार्ग रुका|प्रगति सहेजी गई|सहेजा नहीं जा सका। फिर कोशिश करें।|बंद करें|जुड़ी चरखियाँ|अंतर गियर|हवा अवरोधक|साधारण चरखियाँ|कांस्य पट्टी|हीरे|खरीदें|लगाएँ|लगा हुआ|हीरे कम हैं',
  'अभ्यास दोहराएँ|3D दृश्य उपलब्ध नहीं है।|3D दृश्य लौटने की प्रतीक्षा है।|मेहराब पार|मेहराब छूटा|पिछली मेहराब पर लौटे|अगली हवा|झलक',
  'चरखी का बदलाव चुनकर उसका असर देखें। गुब्बारे को मेहराब से ले जाने के लिए पुष्टि करें।|रस्सी खींचने पर गुब्बारा ऊपर उठता है। वह ज़्यादा खिंची ओर झुकता है। तीर हवा का असर दिखाता है।|तीन सितारों के लिए सभी मेहराब पार करें और हर रिबन जोड़ा लें। कदम वापस ले सकते हैं।|रिबन कैसे मिलते हैं?|निशान वाली दोनों मेहराब लगातार पार करें। पहली छूटने पर चाल वापस लें।|क्या औज़ार खरीदने होंगे?|साधारण चरखियों से हर मार्ग में तीन सितारे मिल सकते हैं। औज़ार दूसरे रास्ते खोलते हैं।|हर मार्ग में एक बार दोनों रस्सियाँ साथ खींचें या ढीली करें।|हर मार्ग में एक बार ऊँचाई बदले बिना झुकाव बदलें।|दोनों रस्सियाँ स्थिर रखकर एक मेहराब पर हवा का असर मिटाएँ।|पतंगे वाले गुब्बारे की स्थायी कांस्य पट्टी।|गुब्बारा एक स्तर उठाएँ। एक तरफ़ की रस्सी खींचकर मेहराब पार करें।',
  'शतकीय परेड से पहले हवा के झोंकों पर नज़र|न्यूयॉर्क में 25 नवंबर 2026 को गुब्बारे फुलाने का सार्वजनिक कार्यक्रम तय था। अगले दिन सौवीं थैंक्सगिविंग परेड होनी थी।|तेज़ हवा के अनुमान से विशाल गुब्बारों पर ध्यान गया। तैयारी के समय उनकी उड़ान का फ़ैसला बाकी था।|काल्पनिक मेले में झोंके भाँपें और दो चरखियों को संतुलित रखकर पतंगे का गुब्बारा मेहराबों से निकालें।'
]);

install('ar', 'حبلان في الريح', 'لغز توازن', 'اضبط بكرتين لتمرير بالون المهرجان عبر الأقواس رغم هبات الريح.', [
  'ابدأ|مسار|المسارات|ورشة البكرات|دليل اللعبة|رجوع|إيقاف مؤقت|الهدف|طريقة اللعب|التحكم والقواعد|إكمال المسار|الأسئلة الشائعة|ألعاب ذات صلة',
  'شد اليسار|شد اليمين|أرخ اليسار|أرخ اليمين|ثبّت|شد الحبلين|أرخ الحبلين|أمل لليسار|أمل لليمين|خفف الريح',
  'الريح|الارتفاع|الميل|يسار|يمين|هادئة|قوس|مقفل|زوج أشرطة|عبور إلزامي|داخل القوس|منخفض جداً|مرتفع جداً|الميل خارج القوس|فاتك الشريط الأول|غير متاح|بلغت البكرة حدها|اختر حركة للبكرة.',
  'اعبر القوس|تراجع|أعد المحاولة|المسار التالي|جاهز|مكتمل|اكتمل المسار|توقف المسار|حُفظ التقدم|تعذر الحفظ. حاول مجدداً.|إغلاق|بكرتان مترابطتان|ترس تفاضلي|مخفف الريح|البكرات الأساسية|وشاح برونزي|ألماسات|شراء|تجهيز|مجهّز|لا ألماسات كافية',
  'أعد التدريب|المشهد الثلاثي الأبعاد غير متاح.|بانتظار عودة المشهد الثلاثي الأبعاد.|عبرت القوس|أخفقت في العبور|عدت إلى القوس السابق|الريح التالية|معاينة',
  'اختر حركة للبكرة لمعاينة نتيجتها. أكّد لتحريك البالون عبر القوس.|يرتفع البالون عند شد الحبل ويميل نحو الجانب الأكثر شداً. يبيّن السهم أثر الريح.|اعبر كل الأقواس واجمع كل أزواج الأشرطة لتحصل على ثلاث نجوم. يمكنك التراجع أو البدء من جديد.|كيف أجمع الأشرطة؟|اعبر القوسين المعلّمين تباعاً. إن فاتك الأول فتراجع.|هل أحتاج إلى شراء أدوات؟|تكفي البكرات الأساسية لنيل ثلاث نجوم في كل مسار. تضيف الأدوات حلولاً أخرى.|شد الحبلين أو أرخِهما معاً مرة في كل مسار.|غيّر الميل من دون تغيير الارتفاع مرة في كل مسار.|ألغِ أثر الريح عند قوس واحد مع تثبيت الحبلين.|وشاح برونزي دائم لبالون العثة.|ارفع البالون درجة واحدة. شد أحد الحبلين ثم اعبر القوس.',
  'هبات الريح تلفت الأنظار قبل موكب تاريخي|حددت نيويورك يوم 25 نوفمبر 2026 لعرض نفخ البالونات أمام الجمهور، عشية موكب عيد الشكر المئة.|أثارت توقعات الرياح القوية تساؤلات بشأن البالونات العملاقة. خلال التحضيرات ظل قرار تحليقها معلقاً.|في المهرجان الخيالي، توقّع الهبات ووازن بين بكرتين لتمرير بالون عثة عبر الأقواس.'
]);

export const leaves = {
  en: ['Continue playing', 'Return to routes and lose the moves from this route. Saved progress stays.'],
  'zh-Hant': ['繼續遊玩', '返回關卡將捨棄這一段尚未完成的操作，已存進度會保留。'],
  'zh-Hans': ['继续游戏', '返回关卡将舍弃这段尚未完成的操作，已存进度会保留。'],
  ja: ['続ける', '一覧に戻るとこのルートの途中経過は失われます。保存済みの進行は残ります。'],
  ko: ['계속하기', '목록으로 돌아가면 이 길의 진행 중인 조작이 사라집니다. 저장된 진행은 유지됩니다.'],
  es: ['Seguir jugando', 'Volver a las rutas descarta las jugadas de este recorrido. Se conserva el progreso guardado.'],
  'pt-BR': ['Continuar jogando', 'Voltar às rotas descarta as jogadas da rota atual. O progresso salvo permanece.'],
  fr: ['Continuer à jouer', 'Le retour aux parcours efface les coups du parcours en cours. La progression enregistrée est conservée.'],
  de: ['Weiterspielen', 'Zurück zur Auswahl verwirft die Züge dieser Strecke. Gespeicherter Fortschritt bleibt erhalten.'],
  it: ['Continua a giocare', 'Tornando ai percorsi perdi le mosse in corso. I progressi salvati restano.'],
  ru: ['Продолжить игру', 'При возврате к списку ходы текущего маршрута будут потеряны. Сохранённый прогресс останется.'],
  hi: ['खेल जारी रखें', 'मार्ग सूची पर लौटने से इस मार्ग की चालें मिटेंगी। सहेजी हुई प्रगति रहेगी।'],
  ar: ['واصل اللعب', 'العودة إلى المسارات تلغي حركات المسار الحالي. يبقى التقدم المحفوظ.']
};
