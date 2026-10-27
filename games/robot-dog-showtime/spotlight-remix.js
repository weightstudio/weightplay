export const spotlightStageIds = Object.freeze([2, 3, 6]);

export function spotlightGoals(goals) {
  if (!Array.isArray(goals) || goals.length !== 2) throw new TypeError("TWO_PERFORMER_GOALS_REQUIRED");
  return [goals[1], goals[0]];
}

export function spotlightAvailable(stageId, cleared) {
  return spotlightStageIds.includes(stageId) && Array.isArray(cleared) && cleared.includes(stageId);
}

const steps = Object.freeze({N:[0,-1],E:[1,0],S:[0,1],W:[-1,0],WAIT:[0,0],BOW:[0,0],WAVE:[0,0]});

// Preview and performance share this evaluator. Rendering never decides a verdict.
export function evaluatePlan(stage, plan, goals=stage.goals) {
  let positions=[...stage.starts], missing=0;
  const frames=[];
  const stop=(code,beat,actor=0)=>({success:false,frames,positions,missing,failure:{code,beat,actor}});
  for(let beat=0;beat<stage.beats;beat++) {
    const cues=[0,1].map(actor=>{const cue=plan[beat]?.[actor];if(!cue)missing++;return cue||'WAIT'});
    const next=[];
    for(let actor=0;actor<2;actor++) {
      const delta=steps[cues[actor]];
      if(!delta)return stop('CUE',beat,actor);
      const x=positions[actor]%4+delta[0],y=Math.floor(positions[actor]/4)+delta[1];
      if(x<0||x>3||y<0||y>2)return stop('EDGE',beat,actor);
      const cell=y*4+x;
      if(stage.walls.includes(cell))return stop('BLOCKED',beat,actor);
      next.push(cell);
    }
    if(next[0]===next[1])return stop('COLLISION',beat,1);
    if(next[0]===positions[1]&&next[1]===positions[0])return stop('CROSSING',beat,1);
    positions=next;
    frames.push({beat,positions:[...positions],cues});
  }
  if(positions.some((cell,actor)=>cell!==goals[actor]))return stop('FORMATION',stage.beats-1,positions[0]!==goals[0]?0:1);
  if(stage.bow&&(plan.at(-1)?.[0]!=='BOW'||plan.at(-1)?.[1]!=='BOW'))return stop('BOW',stage.beats-1);
  return {success:true,frames,positions,missing,failure:null};
}

const keys=['pup','fox','stage','beat','mark','wait','bow','wave','rehearse','stop','undo','reset','hint','help','continue','stages','next','replay','ready','locked','cleared','mix','wardrobe','costume','base','equip','equipped','buy','permanent','balance','cancel','perfect','smooth','encore','plan','edge','blocked','collision','crossing','formation','finalBow','saved','storage','insufficient','practice','loading','summary','hintRule','costumeRule','masteryRule'];
const dictionaries={
  en:['Robot Pup','Fox Partner','Stage','Beat','Mark','Wait','Bow','Wave','Rehearse','Stop','Undo','Reset','Hint','How to play','Continue','Stages','Next stage','Replay','Ready','Locked','Cleared','Spotlight Mix','Dressing room','Comet costume','Original costume','Equip','Equipped','Unlock','Permanent','Diamonds','Cancel','Perfect show!','Smooth show!','Encore!','Choose a cue for each performer.','Outside the stage','Blocked mark','Same mark','Routes cross','Reach both colored goals','Both Bow on the final beat','Saved','Storage unavailable. Try again.','Not enough diamonds','Local practice','Loading…','Plan two routes. Put on one great show.','A hint fills one beat. Hints keep the top rating at 1/3.','Blue comet scarf, golden paws and matching stage lights. Appearance only.','3/3: first rehearsal without hints. 2/3: within three rehearsals without hints. Best ratings are saved.'],
  'zh-Hant':['機器狗','狐狸搭檔','關卡','拍點','位置','等待','鞠躬','揮手','開始排練','停止','復原','重設','提示','玩法說明','繼續','關卡','下一關','再演一次','準備好了','未解鎖','已完成','聚光混搭','更衣室','彗星演出服','原創演出服','穿上','已穿上','解鎖','永久收藏','鑽石','取消','完美演出！','流暢演出！','精彩謝幕！','為兩位搭檔安排每拍動作。','超出舞台','位置被封鎖','兩位占用相同位置','路線迎面交錯','兩位都要抵達各自的彩色目標','最後一拍一起鞠躬','已儲存','無法儲存，請重試。','鑽石不足','本機練習','載入中…','編排兩條路線，一起登台發光。','提示會填入一拍；使用提示後本次評價最高為 1/3。','藍色彗星圍巾、金色爪套與搭配燈光，僅改變外觀。','3/3：無提示、首次排練成功。2/3：無提示、三次內成功。保留最高評價。'],
  'zh-Hans':['机器狗','狐狸搭档','关卡','拍点','位置','等待','鞠躬','挥手','开始排练','停止','撤销','重置','提示','玩法说明','继续','关卡','下一关','再演一次','准备好了','未解锁','已完成','聚光混搭','更衣室','彗星演出服','原创演出服','穿上','已穿上','解锁','永久收藏','钻石','取消','完美演出！','流畅演出！','精彩谢幕！','为两位搭档安排每拍动作。','超出舞台','位置被封锁','两位占用相同位置','路线迎面交错','两位都要抵达各自的彩色目标','最后一拍一起鞠躬','已保存','无法保存，请重试。','钻石不足','本地练习','加载中…','编排两条路线，一起登台发光。','提示会填入一拍；使用提示后本次评价最高为 1/3。','蓝色彗星围巾、金色爪套与搭配灯光，仅改变外观。','3/3：无提示、首次排练成功。2/3：无提示、三次内成功。保留最高评价。'],
  ja:['ロボット犬','キツネの相棒','ステージ','拍','マス','待つ','お辞儀','手を振る','リハーサル','停止','戻す','リセット','ヒント','遊び方','続ける','ステージ','次へ','再演','準備完了','未解放','クリア','ミックス','衣装室','彗星の衣装','標準の衣装','着る','着用中','解放','永久','ダイヤ','キャンセル','完璧な舞台！','見事な舞台！','アンコール！','二人の各拍の動作を選びます。','舞台の外','通れないマス','同じマス','経路が交差','二人を色付きの目標へ','最後の拍は二人でお辞儀','保存済み','保存できません。再試行してください。','ダイヤ不足','ローカル練習','読込中…','二つの経路で、一つの舞台を。','ヒントは1拍を埋めます。使うと今回の評価は最大1/3。','青い彗星スカーフ、金の足と照明。外見のみ。','ヒントなしで初回成功は3/3、3回以内は2/3。最高評価を保存。'],
  ko:['로봇 강아지','여우 파트너','스테이지','박자','칸','대기','인사','손 흔들기','리허설','정지','되돌리기','초기화','힌트','플레이 방법','계속','스테이지','다음','다시 공연','준비','잠김','완료','스포트라이트 믹스','의상실','혜성 의상','기본 의상','착용','착용 중','해제','영구','다이아몬드','취소','완벽한 공연!','멋진 공연!','앙코르!','두 공연자의 박자별 동작을 고르세요.','무대 밖','막힌 칸','같은 칸','경로 교차','두 색깔 목표에 도착하세요','마지막 박자에 함께 인사','저장됨','저장할 수 없습니다. 다시 시도하세요.','다이아몬드 부족','로컬 연습','로딩 중…','두 경로로 하나의 공연을 완성하세요.','힌트는 한 박자를 채웁니다. 사용 시 이번 평가는 최대 1/3입니다.','파란 혜성 목도리, 금빛 발과 조명. 외형만 변경.','힌트 없이 첫 성공은 3/3, 세 번 이내는 2/3. 최고 평가 저장.'],
  es:['Cachorro robot','Zorro','Escenario','Tiempo','Casilla','Espera','Saludo','Agitar','Ensayar','Parar','Deshacer','Reiniciar','Pista','Cómo jugar','Continuar','Escenarios','Siguiente','Repetir','Listo','Bloqueado','Superado','Mezcla de focos','Vestuario','Traje cometa','Traje original','Equipar','Equipado','Desbloquear','Permanente','Diamantes','Cancelar','¡Perfecto!','¡Gran función!','¡Otra vez!','Elige las acciones de ambos artistas.','Fuera del escenario','Casilla bloqueada','Misma casilla','Cruce de rutas','Alcanza ambas metas de color','Ambos saludan en el último tiempo','Guardado','No se pudo guardar. Reintenta.','Faltan diamantes','Práctica local','Cargando…','Dos rutas, una gran función.','La pista rellena un tiempo y limita esta nota a 1/3.','Bufanda azul, patas doradas y luces a juego. Solo apariencia.','Sin pistas: 3/3 al primer ensayo; 2/3 en tres. Se guarda la mejor nota.'],
  'pt-BR':['Cão robô','Raposa','Fase','Batida','Casa','Esperar','Reverência','Acenar','Ensaiar','Parar','Desfazer','Reiniciar','Dica','Como jogar','Continuar','Fases','Próxima','Repetir','Pronto','Bloqueado','Concluído','Mistura de luzes','Camarim','Traje cometa','Traje original','Equipar','Equipado','Desbloquear','Permanente','Diamantes','Cancelar','Show perfeito!','Belo show!','Bis!','Escolha as ações dos dois artistas.','Fora do palco','Casa bloqueada','Mesma casa','Rotas se cruzam','Alcance as duas metas coloridas','Ambos fazem reverência no final','Salvo','Não foi possível salvar. Tente de novo.','Diamantes insuficientes','Treino local','Carregando…','Duas rotas, um grande show.','A dica preenche uma batida e limita a nota a 1/3.','Cachecol azul, patas douradas e luzes combinando. Só aparência.','Sem dicas: 3/3 no primeiro ensaio; 2/3 em três. A melhor nota fica salva.'],
  fr:['Chiot robot','Renard','Scène','Temps','Case','Attendre','Saluer','Agiter','Répéter','Arrêter','Annuler','Réinitialiser','Indice','Comment jouer','Continuer','Scènes','Suite','Rejouer','Prêt','Verrouillé','Réussi','Mix des projecteurs','Loge','Tenue comète','Tenue originale','Porter','Équipée','Débloquer','Permanent','Diamants','Annuler','Parfait !','Beau spectacle !','Bis !','Choisissez les actions des deux artistes.','Hors de scène','Case bloquée','Même case','Trajets croisés','Atteignez les deux cibles colorées','Les deux saluent au dernier temps','Enregistré','Échec de sauvegarde. Réessayez.','Diamants insuffisants','Entraînement local','Chargement…','Deux parcours, un grand spectacle.','Un indice remplit un temps et limite la note à 1/3.','Écharpe bleue, pattes dorées et lumières assorties. Apparence seule.','Sans indice : 3/3 au premier essai, 2/3 en trois. Meilleure note conservée.'],
  de:['Roboterwelpe','Fuchs','Bühne','Takt','Feld','Warten','Verbeugen','Winken','Proben','Stopp','Rückgängig','Zurücksetzen','Tipp','Spielanleitung','Weiter','Bühnen','Nächste','Wiederholen','Bereit','Gesperrt','Geschafft','Spotlight-Mix','Garderobe','Kometenkostüm','Originalkostüm','Anziehen','Angelegt','Freischalten','Dauerhaft','Diamanten','Abbrechen','Perfekte Show!','Tolle Show!','Zugabe!','Wähle für beide Akteure jeden Takt.','Außerhalb der Bühne','Gesperrtes Feld','Gleiches Feld','Wege kreuzen sich','Erreiche beide farbigen Ziele','Beide verbeugen sich im letzten Takt','Gespeichert','Speichern fehlgeschlagen. Erneut versuchen.','Nicht genug Diamanten','Lokales Training','Lädt…','Zwei Wege, eine große Show.','Ein Tipp füllt einen Takt und begrenzt die Wertung auf 1/3.','Blauer Schal, goldene Pfoten und passende Lichter. Nur Optik.','Ohne Tipps: 3/3 im ersten Versuch, 2/3 in drei. Bestwertung gespeichert.'],
  it:['Cucciolo robot','Volpe','Palco','Tempo','Casella','Aspetta','Inchino','Saluta','Prova','Ferma','Annulla','Azzera','Indizio','Come giocare','Continua','Palchi','Avanti','Riprova','Pronto','Bloccato','Completato','Mix di luci','Camerino','Abito cometa','Abito originale','Indossa','Indossato','Sblocca','Permanente','Diamanti','Annulla','Spettacolo perfetto!','Ottimo spettacolo!','Bis!','Scegli le azioni di entrambi gli artisti.','Fuori dal palco','Casella bloccata','Stessa casella','Percorsi incrociati','Raggiungi entrambi gli obiettivi colorati','Entrambi si inchinano all’ultimo tempo','Salvato','Impossibile salvare. Riprova.','Diamanti insufficienti','Pratica locale','Caricamento…','Due percorsi, un grande spettacolo.','Un indizio riempie un tempo e limita il voto a 1/3.','Sciarpa blu, zampe dorate e luci abbinate. Solo aspetto.','Senza indizi: 3/3 alla prima prova; 2/3 entro tre. Miglior voto salvato.'],
  ru:['Робопёс','Лис','Сцена','Такт','Клетка','Ждать','Поклон','Махать','Репетиция','Стоп','Отмена','Сброс','Подсказка','Как играть','Продолжить','Сцены','Далее','Повтор','Готово','Закрыто','Пройдено','Микс прожекторов','Костюмерная','Костюм кометы','Обычный костюм','Надеть','Надет','Открыть','Навсегда','Алмазы','Отмена','Идеальное шоу!','Отличное шоу!','На бис!','Выберите действия обоих артистов.','За пределами сцены','Клетка закрыта','Одна клетка','Маршруты пересекаются','Достигните обеих цветных целей','Оба кланяются на последнем такте','Сохранено','Не удалось сохранить. Повторите.','Недостаточно алмазов','Локальная практика','Загрузка…','Два маршрута, одно яркое шоу.','Подсказка заполняет такт и ограничивает оценку до 1/3.','Синий шарф, золотые лапы и свет. Только внешний вид.','Без подсказок: 3/3 с первой репетиции, 2/3 за три. Лучший балл сохранён.'],
  hi:['रोबोट पिल्ला','लोमड़ी','मंच','ताल','खाना','रुको','झुको','हाथ हिलाओ','अभ्यास','रुको','पूर्ववत','रीसेट','संकेत','कैसे खेलें','जारी रखें','मंच','अगला','फिर खेलें','तैयार','बंद','पूरा','स्पॉटलाइट मिक्स','पोशाक कक्ष','धूमकेतु पोशाक','मूल पोशाक','पहनें','पहना है','खोलें','स्थायी','हीरे','रद्द','बेहतरीन शो!','सुंदर शो!','एक बार और!','दोनों कलाकारों की हर ताल की चाल चुनें।','मंच से बाहर','बंद खाना','एक ही खाना','रास्ते टकराते हैं','दोनों रंगीन लक्ष्यों तक पहुँचें','अंतिम ताल पर दोनों झुकें','सहेजा गया','सहेज नहीं सके। फिर कोशिश करें।','पर्याप्त हीरे नहीं','स्थानीय अभ्यास','लोड हो रहा है…','दो रास्ते, एक शानदार शो।','संकेत एक ताल भरता है और इस बार अधिकतम 1/3 अंक देता है।','नीला दुपट्टा, सुनहरे पंजे और रोशनी। केवल रूप बदलता है।','बिना संकेत पहली बार 3/3, तीन बार में 2/3। सर्वश्रेष्ठ अंक सहेजते हैं।'],
  ar:['الجرو الآلي','الثعلب','المسرح','النبضة','الخانة','انتظر','انحنِ','لوّح','تدرّب','توقف','تراجع','إعادة ضبط','تلميح','طريقة اللعب','متابعة','المراحل','التالي','إعادة','جاهز','مقفل','مكتمل','مزيج الأضواء','غرفة الأزياء','زي المذنب','الزي الأصلي','ارتداء','مُرتدى','فتح','دائم','الألماس','إلغاء','عرض مثالي!','عرض رائع!','مرة أخرى!','اختر حركة لكل نبضة ولكل مؤدٍّ.','خارج المسرح','خانة محجوبة','الخانة نفسها','تتقاطع المسارات','بلوغ الهدفين الملونين','ينحني الاثنان في النبضة الأخيرة','تم الحفظ','تعذّر الحفظ. حاول مجدداً.','الألماس غير كافٍ','تدريب محلي','جارٍ التحميل…','مساران لعرض واحد رائع.','يملأ التلميح نبضة واحدة ويحدّ التقييم إلى 1/3.','وشاح أزرق وأقدام ذهبية وإضاءة متناسقة. مظهر فقط.','بلا تلميحات: 3/3 من أول تدريب، و2/3 خلال ثلاث محاولات. يُحفظ الأفضل.'],
};
export const showLocales=Object.freeze(Object.keys(dictionaries));
const extra={
  en:['Returning stops this rehearsal. Saved cues and cleared stages are kept.','The 3D stage could not load. Retry or return to Stages.','Clear cue'],
  'zh-Hant':['返回關卡會停止本次排練；已儲存的動作草稿與通關進度會保留。','3D 舞台無法載入，請重試或返回關卡。','清除動作'],
  'zh-Hans':['返回关卡会停止本次排练；已保存的动作草稿与通关进度会保留。','3D 舞台无法加载，请重试或返回关卡。','清除动作'],
  ja:['戻るとリハーサルを停止します。保存した動作とクリア進行は残ります。','3D舞台を読み込めません。再試行するかステージへ戻ってください。','動作を消す'],
  ko:['돌아가면 리허설이 멈춥니다. 저장된 동작과 완료한 스테이지는 유지됩니다.','3D 무대를 불러올 수 없습니다. 다시 시도하거나 돌아가세요.','동작 지우기'],
  es:['Volver detiene el ensayo. Se conservan las acciones guardadas y los escenarios superados.','No se pudo cargar el escenario 3D. Reintenta o vuelve.','Borrar acción'],
  'pt-BR':['Voltar encerra o ensaio. As ações salvas e fases concluídas são mantidas.','Não foi possível carregar o palco 3D. Tente de novo ou volte.','Apagar ação'],
  fr:['Revenir arrête la répétition. Les actions sauvegardées et les scènes réussies restent acquises.','La scène 3D ne se charge pas. Réessayez ou revenez.','Effacer l’action'],
  de:['Zurück beendet die Probe. Gespeicherte Aktionen und geschaffte Bühnen bleiben erhalten.','Die 3D-Bühne konnte nicht laden. Erneut versuchen oder zurück.','Aktion löschen'],
  it:['Tornare interrompe la prova. Restano le azioni salvate e i palchi completati.','Impossibile caricare il palco 3D. Riprova o torna indietro.','Cancella azione'],
  ru:['Возврат остановит репетицию. Сохранённые действия и пройденные сцены останутся.','Не удалось загрузить 3D-сцену. Повторите или вернитесь.','Удалить действие'],
  hi:['वापस जाने से अभ्यास रुकता है। सहेजी चालें और पूरे मंच बने रहते हैं।','3D मंच लोड नहीं हुआ। फिर कोशिश करें या वापस जाएँ।','चाल हटाएँ'],
  ar:['توقف العودة هذا التدريب. تبقى الحركات المحفوظة والمراحل المكتملة.','تعذّر تحميل المسرح ثلاثي الأبعاد. حاول مجدداً أو عُد.','مسح الحركة'],
};
export function showText(locale='en') {
  const values=dictionaries[locale]||dictionaries.en;
  if(values.length!==keys.length)throw Error(`SHOW_COPY_LENGTH:${locale}:${values.length}`);
  const copy=Object.fromEntries(keys.map((key,index)=>[key,values[index]]));
  ['leave','renderError','clear'].forEach((key,index)=>copy[key]=(extra[locale]||extra.en)[index]);
  return key=>copy[key]||key;
}
