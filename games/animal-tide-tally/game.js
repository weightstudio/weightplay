/* Tide Tally owner correction, 2026-09-22.
 * One shared Interface 7 frame; the game owns only content and puzzle state.
 * This file is also importable by the focused Node regression tests.
 */
(function () {
  'use strict';
  const raw = [
    [1,'flow',2,[3],[1]], [1,'flow',1,[4],[2]], [1,'flow',3,[2],[1,1]], [1,'flow',2,[5],[3]], [1,'flow',4,[3],[2]],
    [2,'waves',1,[2,3],[1]], [2,'waves',2,[1,4],[2,1]], [2,'waves',3,[3,2],[2,2]], [2,'waves',0,[5,1],[2]], [2,'waves',2,[4,3],[2,1]],
    [3,'missing',2,[],[1],5], [3,'missing',3,[],[2,1],6], [3,'missing',1,[],[1,2],5], [3,'missing',4,[],[3],8], [3,'missing',2,[],[2,2],9],
    [4,'compare',7,[],[],3], [4,'compare',5,[],[],8], [4,'compare',9,[],[],4], [4,'compare',6,[],[],11], [4,'compare',12,[],[],5],
    [5,'two-step',2,[3,2],[1,1]], [5,'two-step',1,[4,2],[2,1]], [5,'two-step',3,[2,5],[1,2]], [5,'two-step',2,[5,3],[2,1]], [5,'two-step',4,[3,4],[2,2]],
    [6,'interference',3,[4],[1],1], [6,'interference',2,[5,2],[1,2],1], [6,'interference',1,[3,4],[2,1],2], [6,'interference',4,[6],[2],3], [6,'interference',5,[4,3],[2,2],1]
  ];
  const sum = a => a.reduce((s, n) => s + n, 0);
  function targetOf(n) {
    if (n.mode === 'compare') return Math.abs(n.left - n.right);
    if (n.mode === 'missing') return n.final - n.start + sum(n.departures);
    return n.start + sum(n.arrivals) - sum(n.departures) - (n.interference || 0);
  }
  const notes = raw.map(([arc, mode, start, arrivals, departures, extra], i) => {
    const n = { id:i+1, arc, mode, start, arrivals, departures, checkpoint:(i+1)%5 === 0 };
    if (mode === 'missing') n.final = extra;
    if (mode === 'compare') { n.left = start; n.right = extra; }
    if (mode === 'interference') n.interference = extra;
    n.target = targetOf(n); n.answers = [n.target-1, n.target, n.target+1];
    return Object.freeze(n);
  });
  function shuffle(values, rng = Math.random) {
    const out = [...values];
    for (let i = out.length-1; i > 0; --i) {
      const j = Math.min(i, Math.max(0, Math.floor(rng() * (i+1))));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  // Replay changes a quantity, not just the answer's position. Keep the
  // authored mechanic and non-negative, bounded counts of this same note.
  function variation(note, rng = Math.random) {
    const n = {...note, arrivals:[...note.arrivals], departures:[...note.departures]};
    const delta = rng() < .5 ? 1 : 2;
    if (n.mode === 'missing') n.final += delta;
    else if (n.mode === 'compare') {
      if (n.left >= n.right) n.left += delta; else n.right += delta;
    } else n.start += delta;
    n.target = targetOf(n); n.answers = [n.target-1, n.target, n.target+1];
    return n;
  }
  function stepsOf(note) {
    if (note.mode === 'compare') return [{kind:'compare', left:note.left, right:note.right}];
    const steps = [{kind:'start', amount:note.start, count:note.start}];
    if (note.mode === 'missing') {
      // Neither the unknown delivery nor intermediate totals reveal its size,
      // including to assistive technology. Only the known end pile is shown.
      steps.push({kind:'mystery', amount:null, count:null});
      note.departures.forEach(amount => steps.push({kind:'depart', amount, count:null}));
      steps.push({kind:'final', amount:note.final, count:note.final});
      return steps;
    }
    let count = note.start;
    const add = (kind, amount) => { count += kind === 'arrive' ? amount : -amount; steps.push({kind, amount, count}); };
    if (note.mode === 'two-step') {
      note.arrivals.forEach((amount, i) => { add('arrive', amount); if (note.departures[i] !== undefined) add('depart', note.departures[i]); });
    } else {
      note.arrivals.forEach(amount => add('arrive', amount));
      note.departures.forEach(amount => add('depart', amount));
    }
    if (note.interference) add('crab', note.interference);
    return steps;
  }
  const SAVE_KEY = 'weightplay-animal-tide-tally-progress-v1';
  function readProgress(text) {
    let data;
    try { data = JSON.parse(text || 'null'); } catch { data = null; }
    const source = data && data.schema === 1 && Array.isArray(data.best) ? data.best : [];
    const best = Array.from({length:notes.length}, (_, i) => {
      const v = source[i]; return Number.isInteger(v) && v >= 1 && v <= 3 ? v : 0;
    });
    // A corrupted non-contiguous save must not unlock a future campaign arc.
    let gap = false;
    best.forEach((v, i) => { if (!v) gap = true; if (gap) best[i] = 0; });
    return {schema:1, best};
  }
  const unlocked = progress => Math.min(notes.length-1, progress.best.findIndex(n => !n) < 0 ? notes.length-1 : progress.best.findIndex(n => !n));
  function newRun(note, rng = Math.random) {
    return {note, steps:stepsOf(note), step:0, phase:'watch', checks:0, rejected:[], answers:shuffle(note.answers, rng)};
  }
  function advance(run) {
    if (run.phase !== 'watch') return false;
    if (run.step < run.steps.length-1) run.step += 1; else run.phase = 'answer';
    return true;
  }
  function answer(run, value) {
    if (run.phase !== 'answer' || !run.answers.includes(value) || run.rejected.includes(value)) return null;
    run.checks += 1;
    if (value !== run.note.target) { run.rejected.push(value); return false; }
    run.phase = 'result'; return true;
  }
  function settle(progress, run) {
    if (run.phase !== 'result' || run.settled || run.note.id-1 > unlocked(progress)) return false;
    run.settled = true;
    const index = run.note.id-1;
    progress.best[index] = Math.max(progress.best[index], 4-run.checks);
    return true;
  }
  const model = {notes, targetOf, shuffle, variation, stepsOf, readProgress, unlocked, newRun, advance, answer, settle, SAVE_KEY};
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const $ = id => document.getElementById(id);
  const app = $('app');
  if (!app || app.dataset.tideMounted) return;
  // Set synchronously before the bootstrap's DOMContentLoaded auto-discovery.
  app.dataset.wpFrameRoot = ''; app.dataset.tideMounted = 'true';
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key,value); return true; } catch { return false; } }
  };
  const routes = {en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  let locale = routes[location.pathname.split('/').filter(Boolean)[0]] || document.documentElement.lang || 'en';
  const catalog = window.ANIMAL_TIDE_TALLY_LOCALES || {};
  if (!catalog[locale]) locale = 'en';
  const labels = {};
  // This ordered compact catalog contains all new player-facing and assistive
  // text. Existing mechanic names and official route titles are retained.
  const keys = ['start','stages','watch','respond','rewatch','retry','locked','ready','cleared','missingQuestion','compareQuestion','arrive','depart','initial','final','mystery','crab','watchHint','flowHint','missingHint','compareHint','leaveTitle','leaveText','stay','leave','stars','checks','saved','sessionOnly','leftCove','rightCove','guide','loadError','summary'];
  const put = (lang, values) => { if(values.length !== keys.length) throw Error('TIDE_COPY_LENGTH:'+lang); labels[lang] = Object.fromEntries(keys.map((key,i)=>[key,values[i]])); };
  put('en', ['Start Game','Stages','Next wave','Answer','Watch again','New tide','Locked','Ready','Cleared','How many shells did the hidden wave bring?','How many more shells does the fuller cove have?','Arriving','Leaving','At the start','At the end','Hidden arrival','Crab takes','Follow each wave. There is no timer.','Add arrivals and subtract departures, including the crab.','Work backwards: final + departures − start.','Match the two piles; count the shells left over.','Leave this note?','This attempt will end. Completed notes stay saved.','Keep playing','Leave','Stars: {value} / 3','Attempts: {value}','Progress saved in this browser.','Storage unavailable: progress lasts only for this session.','Cove A','Cove B','Advance waves at your own pace, then answer. Watch again without resetting mistakes. Clear notes in order; earn three stars on a first correct answer, two after one mistake, or one after two. New tide changes the numbers for another attempt. Progress and best stars are saved locally when browser storage is available.','The shared interface could not load. Reload this page to retry.','Follow the shell-filled waves and solve each cove’s number puzzle.']);
  put('zh-Hant', ['開始遊戲','關卡','下一波','開始作答','重看潮汐','新潮汐','未解鎖','可挑戰','已完成','被遮住的那一波帶來幾顆貝殼？','比較兩座海灣，較多的一邊多幾顆？','帶來','帶走','原本有','最後有','神祕來潮','螃蟹拿走','逐波觀察，不限時間。','加上帶來的，再扣掉帶走與螃蟹拿走的。','倒著推算：最後數量＋帶走的－原本的。','把兩邊一一配對，再數多出來的。','離開這張筆記？','本次作答將結束，已完成的關卡會保留。','繼續遊戲','離開','星星：{value} / 3','作答：{value} 次','進度已儲存在此瀏覽器。','無法使用儲存空間，進度僅保留於本次遊玩。','海灣 A','海灣 B','自行推進每一波潮汐，再選答案。重看不會清除本次答錯次數。依序通關；首次答對獲得三星，答錯一次獲得兩星，答錯兩次獲得一星。「新潮汐」會更換數字供重玩。瀏覽器允許儲存時，通關進度與各關最佳星數會自動保留。','共用介面載入失敗，請重新整理頁面重試。','逐波觀察貝殼的變化，解開每座海灣的數量謎題。']);
  put('zh-Hans', ['开始游戏','关卡','下一波','开始作答','重看潮汐','新潮汐','未解锁','可挑战','已完成','被遮住的那一波带来几颗贝壳？','比较两座海湾，较多的一边多几颗？','带来','带走','原本有','最后有','神秘来潮','螃蟹拿走','逐波观察，不限时间。','加上带来的，再减去带走和螃蟹拿走的。','倒着推算：最后数量＋带走的－原本的。','把两边一一配对，再数多出来的。','离开这张笔记？','本次作答将结束，已完成的关卡会保留。','继续游戏','离开','星星：{value} / 3','作答：{value} 次','进度已保存在此浏览器。','无法使用存储空间，进度仅保留于本次游玩。','海湾 A','海湾 B','自行推进每一波潮汐，再选答案。重看不会清除本次答错次数。依序通关；首次答对获得三星，答错一次获得两星，答错两次获得一星。“新潮汐”会更换数字供重玩。浏览器允许存储时，通关进度与各关最佳星数会自动保留。','共用界面加载失败，请刷新页面重试。','逐波观察贝壳的变化，解开每座海湾的数量谜题。']);
  put('ja', ['ゲーム開始','ステージ','次の波','答える','もう一度見る','新しい潮','ロック中','挑戦可能','クリア','隠れた波はいくつ貝を運びましたか？','多い方の入り江には、いくつ多くありますか？','届く','去る','最初','最後','隠れた波','カニが取る','波を順番に見ましょう。時間制限はありません。','届いた貝を足し、去った貝とカニが取った貝を引きます。','逆算しましょう：最後＋去った数−最初。','二つの山を一対ずつ合わせ、余りを数えます。','このノートを終了しますか？','今回の挑戦は終了します。クリア済みのノートは残ります。','続ける','終了','星：{value} / 3','回答：{value} 回','このブラウザーに進行状況を保存しました。','保存できないため、進行状況は今回のプレイ中のみ保持されます。','入り江 A','入り江 B','自分のペースで波を進めて答えましょう。見直しても間違えた回数は消えません。順番にクリアし、初回正解で星三つ、一回の間違いで二つ、二回で一つです。新しい潮では数字が変わります。保存が許可されていれば、進行状況と各ノートの最高星数がブラウザーに残ります。','共通画面を読み込めませんでした。ページを再読み込みしてください。','波ごとの貝の変化を見て、入り江の数の謎を解きましょう。']);
  put('ko', ['게임 시작','스테이지','다음 파도','답하기','다시 보기','새 조수','잠김','도전 가능','완료','가려진 파도는 조개를 몇 개 가져왔나요?','조개가 더 많은 만에는 몇 개가 더 있나요?','들어옴','떠남','처음','마지막','숨겨진 파도','게가 가져감','파도를 차례로 보세요. 시간제한은 없어요.','온 조개를 더하고 떠난 조개와 게가 가져간 조개를 빼세요.','거꾸로 계산하세요: 마지막＋떠난 수−처음.','두 무더기를 하나씩 짝지어 남은 수를 세세요.','이 노트를 나갈까요?','이번 도전은 종료되지만 완료한 노트는 유지돼요.','계속하기','나가기','별: {value} / 3','시도: {value}회','이 브라우저에 진행 상황을 저장했어요.','저장 공간을 사용할 수 없어 이번 플레이 중에만 진행 상황이 유지돼요.','만 A','만 B','원하는 속도로 파도를 넘기고 답하세요. 다시 봐도 오답 횟수는 초기화되지 않아요. 순서대로 완료하며 첫 정답은 별 세 개, 오답 한 번은 두 개, 두 번은 한 개예요. 새 조수에서는 숫자가 달라져요. 브라우저 저장이 가능하면 진행 상황과 각 노트의 최고 별 수가 보존돼요.','공통 화면을 불러오지 못했어요. 페이지를 새로고침하세요.','파도마다 변하는 조개를 관찰하고 만의 숫자 퍼즐을 풀어 보세요.']);
  put('es', ['Iniciar juego','Niveles','Siguiente ola','Responder','Ver de nuevo','Nueva marea','Bloqueado','Disponible','Completado','¿Cuántas conchas trajo la ola oculta?','¿Cuántas conchas de más tiene la cala más llena?','Llegan','Se van','Al principio','Al final','Llegada oculta','El cangrejo toma','Observa cada ola. No hay límite de tiempo.','Suma las llegadas y resta las salidas, incluido el cangrejo.','Calcula hacia atrás: final + salidas − inicio.','Empareja las dos pilas y cuenta las conchas sobrantes.','¿Salir de esta nota?','Este intento terminará. Las notas completadas se conservarán.','Seguir jugando','Salir','Estrellas: {value} / 3','Intentos: {value}','Progreso guardado en este navegador.','No hay almacenamiento: el progreso dura solo esta sesión.','Cala A','Cala B','Avanza las olas a tu ritmo y responde. Volver a mirar no borra los errores. Completa las notas en orden: tres estrellas al acertar a la primera, dos tras un error o una tras dos. Nueva marea cambia los números. El progreso y las mejores estrellas se guardan localmente cuando el navegador lo permite.','No se pudo cargar la interfaz compartida. Recarga la página.','Observa las conchas de cada ola y resuelve el acertijo de la cala.']);
  put('pt-BR', ['Iniciar jogo','Fases','Próxima onda','Responder','Ver novamente','Nova maré','Bloqueada','Disponível','Concluída','Quantas conchas a onda escondida trouxe?','Quantas conchas a mais há na enseada mais cheia?','Chegam','Saem','No início','No final','Chegada oculta','O caranguejo leva','Observe cada onda. Não há limite de tempo.','Some as chegadas e subtraia as saídas, incluindo o caranguejo.','Calcule ao contrário: final + saídas − início.','Forme pares entre as pilhas e conte as conchas restantes.','Sair desta nota?','Esta tentativa terminará. As notas concluídas serão mantidas.','Continuar','Sair','Estrelas: {value} / 3','Tentativas: {value}','Progresso salvo neste navegador.','Armazenamento indisponível: o progresso dura só esta sessão.','Enseada A','Enseada B','Avance as ondas no seu ritmo e responda. Rever não apaga os erros. Conclua as notas em ordem: três estrelas ao acertar de primeira, duas após um erro ou uma após dois. Nova maré muda os números. O progresso e as melhores estrelas ficam salvos localmente quando o navegador permite.','Não foi possível carregar a interface compartilhada. Recarregue a página.','Observe as conchas de cada onda e resolva o enigma da enseada.']);
  put('fr', ['Commencer le jeu','Niveaux','Vague suivante','Répondre','Revoir','Nouvelle marée','Verrouillé','Disponible','Terminé','Combien de coquillages la vague cachée a-t-elle apportés ?','Combien de coquillages en plus a la crique la plus remplie ?','Arrivées','Départs','Au début','À la fin','Arrivée cachée','Le crabe prend','Observe chaque vague. Il n’y a pas de chronomètre.','Ajoute les arrivées et retire les départs, y compris ceux du crabe.','Remonte le calcul : fin + départs − début.','Associe les deux tas par paires et compte ce qui reste.','Quitter cette note ?','Cet essai prendra fin. Les notes terminées seront conservées.','Continuer','Quitter','Étoiles : {value} / 3','Essais : {value}','Progression enregistrée dans ce navigateur.','Stockage indisponible : progression limitée à cette session.','Crique A','Crique B','Avance les vagues à ton rythme puis réponds. Revoir n’efface pas les erreurs. Termine les notes dans l’ordre : trois étoiles au premier essai, deux après une erreur ou une après deux. Nouvelle marée change les nombres. La progression et les meilleures étoiles sont conservées localement si le navigateur le permet.','Impossible de charger l’interface partagée. Recharge la page.','Observe les coquillages de chaque vague et résous l’énigme de la crique.']);
  put('de', ['Spiel starten','Level','Nächste Welle','Antworten','Erneut ansehen','Neue Flut','Gesperrt','Bereit','Geschafft','Wie viele Muscheln brachte die verdeckte Welle?','Wie viele Muscheln mehr hat die vollere Bucht?','Kommen','Gehen','Am Anfang','Am Ende','Verdeckte Ankunft','Krabbe nimmt','Beobachte jede Welle. Es gibt kein Zeitlimit.','Addiere Ankünfte und ziehe Abgänge samt Krabbe ab.','Rechne rückwärts: Ende + Abgänge − Anfang.','Bilde Paare aus beiden Haufen und zähle den Rest.','Diese Notiz verlassen?','Dieser Versuch endet. Abgeschlossene Notizen bleiben erhalten.','Weiterspielen','Verlassen','Sterne: {value} / 3','Versuche: {value}','Fortschritt in diesem Browser gespeichert.','Speicher nicht verfügbar: Fortschritt gilt nur für diese Sitzung.','Bucht A','Bucht B','Gehe die Wellen in deinem Tempo durch und antworte. Erneutes Ansehen löscht keine Fehler. Löse die Notizen der Reihe nach: drei Sterne beim ersten Treffer, zwei nach einem Fehler, einen nach zwei. Neue Flut ändert die Zahlen. Fortschritt und beste Sterne werden lokal gespeichert, sofern der Browser dies erlaubt.','Die gemeinsame Oberfläche konnte nicht geladen werden. Lade die Seite neu.','Beobachte die Muscheln jeder Welle und löse das Zahlenrätsel der Bucht.']);
  put('it', ['Inizia il gioco','Livelli','Onda successiva','Rispondi','Riguarda','Nuova marea','Bloccato','Disponibile','Completato','Quante conchiglie ha portato l’onda nascosta?','Quante conchiglie in più ha la baia più piena?','Arrivano','Partono','All’inizio','Alla fine','Arrivo nascosto','Il granchio prende','Osserva ogni onda. Non c’è limite di tempo.','Somma gli arrivi e sottrai le partenze, incluso il granchio.','Calcola al contrario: fine + partenze − inizio.','Abbina le due pile e conta le conchiglie rimaste.','Uscire da questa nota?','Questo tentativo terminerà. Le note completate resteranno salvate.','Continua','Esci','Stelle: {value} / 3','Tentativi: {value}','Progressi salvati in questo browser.','Memoria non disponibile: progressi validi solo per questa sessione.','Baia A','Baia B','Avanza le onde al tuo ritmo e rispondi. Riguardare non cancella gli errori. Completa le note in ordine: tre stelle al primo tentativo, due dopo un errore, una dopo due. Nuova marea cambia i numeri. Progressi e stelle migliori sono salvati localmente se il browser lo permette.','Impossibile caricare l’interfaccia condivisa. Ricarica la pagina.','Osserva le conchiglie di ogni onda e risolvi il rompicapo della baia.']);
  put('ru', ['Начать игру','Уровни','Следующая волна','Ответить','Посмотреть снова','Новый прилив','Закрыто','Доступно','Пройдено','Сколько ракушек принесла скрытая волна?','На сколько ракушек больше в более полной бухте?','Прибывают','Убывают','В начале','В конце','Скрытая волна','Краб забирает','Наблюдайте за каждой волной. Время не ограничено.','Прибавьте прибывшие и вычтите убывшие, включая добычу краба.','Считайте обратно: конец + убывшие − начало.','Составьте пары из двух кучек и посчитайте остаток.','Выйти из этой заметки?','Попытка завершится. Пройденные заметки сохранятся.','Продолжить','Выйти','Звёзды: {value} / 3','Попытки: {value}','Прогресс сохранён в этом браузере.','Хранилище недоступно: прогресс действует только в этой сессии.','Бухта A','Бухта B','Переключайте волны в своём темпе, затем отвечайте. Повторный просмотр не сбрасывает ошибки. Проходите заметки по порядку: три звезды за первый верный ответ, две после одной ошибки, одна после двух. Новый прилив меняет числа. Прогресс и лучшие звёзды сохраняются локально, если браузер это разрешает.','Не удалось загрузить общий интерфейс. Обновите страницу.','Следите за ракушками каждой волны и решайте числовые загадки бухты.']);
  put('hi', ['खेल शुरू करें','स्तर','अगली लहर','उत्तर दें','फिर देखें','नया ज्वार','बंद','उपलब्ध','पूरा','छिपी हुई लहर कितनी सीपियाँ लाई?','भरी हुई खाड़ी में कितनी सीपियाँ अधिक हैं?','आईं','गईं','शुरू में','अंत में','छिपी हुई लहर','केकड़ा ले गया','हर लहर देखें। कोई समय सीमा नहीं है।','आई सीपियाँ जोड़ें और गई सीपियाँ घटाएँ, केकड़े वाली भी।','उल्टा गिनें: अंत + गईं − शुरुआत।','दोनों ढेरों के जोड़े बनाएँ और बची सीपियाँ गिनें।','इस नोट से बाहर जाएँ?','यह प्रयास समाप्त होगा। पूरे किए गए नोट सुरक्षित रहेंगे।','खेलते रहें','बाहर जाएँ','सितारे: {value} / 3','प्रयास: {value}','प्रगति इस ब्राउज़र में सहेजी गई।','भंडारण उपलब्ध नहीं: प्रगति केवल इस सत्र तक रहेगी।','खाड़ी A','खाड़ी B','अपनी गति से लहरें आगे बढ़ाएँ, फिर उत्तर दें। दोबारा देखने से गलतियाँ नहीं मिटतीं। नोट क्रम से पूरा करें: पहले सही उत्तर पर तीन सितारे, एक गलती के बाद दो और दो गलतियों के बाद एक। नया ज्वार संख्याएँ बदलता है। ब्राउज़र की अनुमति होने पर प्रगति और सबसे अच्छे सितारे स्थानीय रूप से सहेजे जाते हैं।','साझा इंटरफ़ेस लोड नहीं हुआ। पृष्ठ फिर से लोड करें।','हर लहर की सीपियाँ देखें और खाड़ी की संख्या पहेली हल करें।']);
  put('ar', ['ابدأ اللعبة','المراحل','الموجة التالية','أجب','شاهد مجددًا','مدّ جديد','مقفل','متاح','مكتمل','كم صدفة جلبت الموجة المخفية؟','بكم صدفة يزيد الخليج الأكثر امتلاءً؟','قادمة','مغادرة','في البداية','في النهاية','موجة مخفية','يأخذ السلطعون','تابع كل موجة. لا يوجد حد زمني.','اجمع القادم واطرح المغادر، بما فيه ما أخذه السلطعون.','احسب عكسيًا: النهاية + المغادر − البداية.','كوّن أزواجًا من الكومتين وعدّ الأصداف الزائدة.','هل تريد مغادرة هذه الملاحظة؟','ستنتهي هذه المحاولة. ستبقى الملاحظات المكتملة محفوظة.','تابع اللعب','غادر','النجوم: {value} / 3','المحاولات: {value}','تم حفظ التقدم في هذا المتصفح.','التخزين غير متاح: يبقى التقدم لهذه الجلسة فقط.','الخليج A','الخليج B','قدّم الموجات بالسرعة المناسبة ثم أجب. إعادة المشاهدة لا تمحو الأخطاء. أكمل الملاحظات بالترتيب: ثلاث نجوم للإجابة الصحيحة الأولى، ونجمتان بعد خطأ، ونجمة بعد خطأين. يغيّر المدّ الجديد الأعداد. يُحفظ التقدم وأفضل النجوم محليًا عندما يسمح المتصفح بالتخزين.','تعذّر تحميل الواجهة المشتركة. أعد تحميل الصفحة.','تابع أصداف كل موجة وحلّ لغز الأعداد في الخليج.']);
  const saveDetails = {
    en:'Thirty notes span six arcs. Cleared notes and the best stars for each note are saved in this browser when storage is available.',
    'zh-Hant':'三十張潮汐筆記分成六個篇章。瀏覽器可儲存時，會保留已完成的關卡與各關最佳星數。',
    'zh-Hans':'三十张潮汐笔记分成六个篇章。浏览器可存储时，会保留已完成的关卡与各关最佳星数。',
    ja:'三十枚の潮ノートは六章に分かれています。保存が可能な場合、クリア状況と各ノートの最高星数がこのブラウザーに残ります。',
    ko:'조수 노트 서른 개는 여섯 장으로 나뉘어요. 저장이 가능하면 완료한 노트와 각 노트의 최고 별 수가 이 브라우저에 남아요.',
    es:'Treinta notas forman seis arcos. Las notas completadas y sus mejores estrellas se guardan en este navegador cuando el almacenamiento está disponible.',
    'pt-BR':'Trinta notas formam seis arcos. As notas concluídas e suas melhores estrelas são salvas neste navegador quando o armazenamento está disponível.',
    fr:'Trente notes forment six chapitres. Les notes terminées et leurs meilleures étoiles sont enregistrées dans ce navigateur si le stockage est disponible.',
    de:'Dreißig Notizen bilden sechs Kapitel. Abgeschlossene Notizen und ihre besten Sterne bleiben in diesem Browser gespeichert, sofern Speicher verfügbar ist.',
    it:'Trenta note formano sei capitoli. Le note completate e le loro stelle migliori vengono salvate in questo browser quando la memoria è disponibile.',
    ru:'Тридцать заметок составляют шесть глав. Пройденные заметки и их лучшие звёзды сохраняются в этом браузере, если хранилище доступно.',
    hi:'तीस नोट छह अध्यायों में हैं। भंडारण उपलब्ध होने पर पूरे नोट और हर नोट के सर्वश्रेष्ठ सितारे इस ब्राउज़र में सहेजे जाते हैं।',
    ar:'تتوزع ثلاثون ملاحظة على ستة فصول. تُحفظ الملاحظات المكتملة وأفضل نجوم كل ملاحظة في هذا المتصفح عندما يكون التخزين متاحًا.'
  };
  const text = (key, vars={}) => Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)), labels[locale]?.[key] || catalog[locale]?.[key] || key);
  const progress = readProgress(storage.get(SAVE_KEY));
  let frame, stageController, scene = 'main', run = null, modal = null, saved = true;
  const lifecycle = new AbortController();
  const listen = (node,type,handler) => node.addEventListener(type,handler,{signal:lifecycle.signal});
  const sfx = id => { try { const result = window.WeightPlayAudio?.play?.(id); result?.catch?.(()=>{}); } catch { /* Sound is optional, never gameplay. */ } };
  const sceneRoots = {};
  const own = (tag, id, className) => { const n=document.createElement(tag); if(id)n.id=id;if(className)n.className=className;return n; };
  function button(id, key, fn, primary=false) {
    const n=own('button',id);n.type='button';n.dataset.wpFrameAction=primary?'primary':'secondary';n.textContent=text(key);listen(n,'click',fn);return n;
  }
  function sheet(name) {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(n=>n.href.split('?')[0].endsWith('/'+name))) return;
    const link=own('link');link.rel='stylesheet';link.href='/src/'+name+'?v=20260922-tide-owner1';document.head.append(link);
  }
  function script(name, ready) {
    if (ready?.()) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      let node=[...document.scripts].find(n=>n.src.split('?')[0].endsWith('/'+name));
      const fresh=!node;
      if(fresh){node=own('script');node.src='/src/'+name+'?v=20260922-tide-owner1';}
      const timeout=setTimeout(()=>finish(Error('Dependency timeout: '+name)),15000);
      function finish(error){clearTimeout(timeout);node.removeEventListener('load',loaded);node.removeEventListener('error',failed);error?reject(error):resolve();}
      function loaded(){finish(ready&&!ready()?Error('Missing API: '+name):null);}
      function failed(){finish(Error('Dependency failed: '+name));}
      node.addEventListener('load',loaded,{once:true});node.addEventListener('error',failed,{once:true});
      if(fresh)document.body.append(node);
    });
  }
  function normalize() {
    const main=$('mainScreen').querySelector('.main-canvas'), mainHeader=main.querySelector('header');
    const mainTitle=mainHeader.querySelector('[data-wp-game-title]');mainTitle.dataset.wpFrameTitle='';
    // Do not replace the official localized name with the old dictionary alias.
    mainTitle.removeAttribute('data-i18n');
    const poster=main.querySelector('.main-poster'), summary=main.querySelector('.main-summary'), copy=own('div');
    poster.dataset.wpFramePoster='';copy.dataset.wpFrameCopy='';summary.dataset.wpFrameSummary='';summary.removeAttribute('data-i18n');summary.textContent=text('summary');
    $('mainProgress').dataset.wpFrameProgress='';
    const start=$('startBtn');start.dataset.wpFrameAction='primary';start.textContent=text('start');start.removeAttribute('data-i18n');
    copy.append(summary,$('mainProgress'),start);
    const mainContent=own('div','mainContent');mainContent.append(poster,copy);
    main.querySelector('.hero-card').replaceWith(mainContent);
    const select=$('localeSelect');select.value=locale;
    const retained=own('div');retained.hidden=true;retained.append(select);app.append(retained);$('settingsPanel').remove();
    // One permanent Guide sibling: never moved during later scene changes.
    const guide=$('gameGuide');app.after(guide);
    const articles=guide.querySelectorAll('.game-info-section');
    if(articles[0]){const ol=articles[0].querySelector('ol');if(ol){const p=own('p');p.textContent=text('guide');ol.replaceWith(p);}}
    if(articles[1]){const p=articles[1].querySelector('p');if(p)p.textContent=saveDetails[locale];}
    if(articles[2]){const p=articles[2].querySelector('p');if(p)p.textContent=text('watchHint')+' '+text('flowHint')+' '+text('missingHint')+' '+text('compareHint');}
    const stage=$('stageScreen').querySelector('.stage-canvas'), stageHeader=stage.querySelector('header');
    stage.dataset.wpStageLandscapeWidth='760';stage.dataset.wpStageLandscapeHeight='334';
    const updateStageArt=()=>stage.style.setProperty('--wp-stage-art',`url("${poster.src}")`);
    updateStageArt();listen(poster,'load',updateStageArt);
    const stageTitle=stageHeader.querySelector('h2');stageTitle.dataset.wpFrameTitle='';stageTitle.hidden=true;
    const workspace=own('div','stageWorkspace','tide-stage-workspace');
    const rail=$('stageList');rail.className='stage-rail';rail.replaceChildren();rail.dataset.wpStageRail='true';rail.dataset.wpStageVirtualDrag='true';rail.setAttribute('aria-label',text('stages'));
    workspace.append(rail);stage.querySelector('.panel-intro')?.remove();$('stageChoices')?.remove();
    const nav=stage.querySelector('.stage-tabs');nav.replaceChildren();nav.dataset.wpFrameStageNav='';nav.setAttribute('aria-label',text('stages'));
    const tab=button('stagesTab','stages',()=>{});tab.dataset.wpFrameAction='tab';tab.dataset.wpFrameStageSlot='stages';tab.setAttribute('role','tab');tab.setAttribute('aria-selected','true');tab.setAttribute('aria-controls','stageWorkspace');nav.append(tab);
    stage.append(workspace,nav);
    const battle=$('battleScreen').querySelector('.battle-canvas'), battleHeader=battle.querySelector('header');
    battleHeader.querySelector('h2').dataset.wpFrameTitle='';$('battleSoundBtn').remove();
    const content=own('div','tidePlay','tide-play');
    const info=own('div','tideHud');
    for(const [id,label] of [['tideNoteHud',text('round')],['tideWaveHud',text('mode_waves')],['tideChecksHud',text('checks',{value:''}).split(/[:：]/)[0].trim()]]){
      const stat=own('div'), caption=own('span'), value=own('b',id);caption.textContent=label;stat.append(caption,value);info.append(stat);
    }
    content.append(info);
    const prompt=own('p','prompt','tide-prompt');
    const visual=own('div','tideVisual','tide-visual');
    const event=own('p','tideEvent','tide-event');event.setAttribute('role','status');event.setAttribute('aria-live','polite');
    const pools=own('div','tidePools','tide-pools');visual.append(event,pools);
    const status=own('p','status','tide-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const answers=own('div','answerGrid','tide-answers');answers.setAttribute('role','group');answers.setAttribute('aria-labelledby','prompt');
    const actions=own('div',null,'tide-actions');
    actions.append(button('waveBtn','watch',()=>{if(scene==='battle'&&!modal&&run&&advance(run)){renderBattle();}}),button('rewatchBtn','rewatch',()=>{
      if(scene!=='battle'||modal||!run||run.phase==='result')return;
      run.step=0;run.phase='watch';renderBattle();$('waveBtn').focus();
    }));
    content.append(prompt,visual,answers,status,actions);
    battle.querySelector('.battle-body').replaceWith(content);
    $('resultScreen').remove();
    // Modal substate lives in the existing Battle canvas, not a fourth scene.
    const overlay=own('section','tideModal','tide-modal');overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','tideModalTitle');
    const card=own('div',null,'tide-modal-card');card.append(own('h2','tideModalTitle'),own('p','tideModalText'),own('p','tideSolution','tide-solution'),own('p','tideSave'),own('div','tideModalActions','tide-modal-actions'));overlay.append(card);battle.append(overlay);
    const scenes={main:{root:main,header:mainHeader,content:mainContent},stage:{root:stage,header:stageHeader,content:workspace},battle:{root:battle,header:battleHeader,content,headerInfo:info}};
    Object.assign(sceneRoots, {main:$('mainScreen'),stage:$('stageScreen'),battle:$('battleScreen')});
    $('stageBackBtn').setAttribute('aria-label',text('back'));$('battleBackBtn').setAttribute('aria-label',text('back'));
    return {scenes,localeSelect:select};
  }
  function updateProgress() { $('mainProgress').textContent=text('progress',{count:progress.best.filter(Boolean).length,total:notes.length}); }
  function closeModal(focus=true) {
    if(!modal)return;const old=modal;modal=null;$('tideModal').hidden=true;
    $('tidePlay').inert=false;sceneRoots.battle.querySelector('header').inert=false;
    if(focus&&old.focus?.isConnected)old.focus.focus({preventScroll:true});
  }
  function show(name) {
    closeModal(false);scene=name;document.body.dataset.screen=name;
    for(const [key,node] of Object.entries(sceneRoots)){node.hidden=key!==name;node.inert=key!==name;}
    $('gameGuide').hidden=name!=='main';frame.activate(name);updateProgress();
    if(name==='stage') {stageController.refresh();stageController.center(unlocked(progress));$('stageBackBtn').focus({preventScroll:true});}
    if(name==='main')$('startBtn').focus({preventScroll:true});
  }
  function stageBind(card,index) {
    const note=notes[index], locked=index>unlocked(progress), stars=progress.best[index];
    card.type='button';card.className='stage-card'+(locked?' locked':'');card.disabled=false;card.setAttribute('aria-disabled',String(locked));
    card.replaceChildren();
    const title=own('strong'), state=own('span'), objective=own('small'), facts=own('small');
    title.textContent=`${text('round')} ${index+1}`;state.textContent=text(locked?'locked':stars?'cleared':'ready');
    objective.textContent=text('mode_'+note.mode);
    facts.textContent=(note.checkpoint?text('checkpoint')+' · ':'')+text('stars',{value:stars});
    card.append(title,state,objective,facts);
    if(index===unlocked(progress))card.dataset.wpStageRecommended='true';else delete card.dataset.wpStageRecommended;
  }
  function startNote(index, freshNumbers=false) {
    if(!Number.isInteger(index)||index<0||index>unlocked(progress)||index>=notes.length)return false;
    run=newRun(freshNumbers?variation(notes[index]):notes[index]);show('battle');renderBattle();$('waveBtn').focus({preventScroll:true});sfx('game.start');return true;
  }
  function pool(count, label, mystery=false) {
    const root=own('div',null,'tide-pool');const caption=own('strong');caption.textContent=label;root.append(caption);
    const pieces=own('div',null,'tide-shells');pieces.setAttribute('aria-label',mystery?text('mystery'):label+' '+count);pieces.setAttribute('role','img');
    if(mystery){const q=own('span',null,'tide-unknown');q.textContent='?';q.setAttribute('aria-hidden','true');pieces.append(q);}
    else if(!count){const zero=own('span',null,'tide-unknown');zero.textContent='0';zero.setAttribute('aria-hidden','true');pieces.append(zero);}
    else for(let i=0;i<count;i++){const shell=own('span',null,'tide-shell');shell.setAttribute('aria-hidden','true');pieces.append(shell);}
    root.append(pieces);return root;
  }
  function question() { return text(run.note.mode==='missing'?'missingQuestion':run.note.mode==='compare'?'compareQuestion':'prompt'); }
  function hint() { return text(run.note.mode==='missing'?'missingHint':run.note.mode==='compare'?'compareHint':'flowHint'); }
  function renderBattle() {
    if(scene!=='battle'||!run)return;
    const step=run.steps[run.step], watching=run.phase==='watch';
    $('tideNoteHud').textContent=`${run.note.id} / ${notes.length}`;$('tideWaveHud').textContent=`${run.step+1} / ${run.steps.length}`;$('tideChecksHud').textContent=String(run.checks);
    $('prompt').textContent=question();
    const pools=$('tidePools');pools.replaceChildren();
    if(step.kind==='compare'){
      $('tideEvent').textContent=text('mode_compare');pools.append(pool(step.left,text('leftCove')),pool(step.right,text('rightCove')));
    } else {
      const key={start:'initial',arrive:'arrive',depart:'depart',crab:'crab',mystery:'mystery',final:'final'}[step.kind];
      const signed=step.amount===null?'?':((step.kind==='arrive'?'+':['depart','crab'].includes(step.kind)?'−':'')+step.amount);
      $('tideEvent').textContent=text(key)+'  '+signed;
      // On observation steps show the change as a real group of shells. The
      // question phase keeps only known clues, not the computed answer pile.
      const amount = watching ? step.amount : run.note.mode==='missing'?run.note.final:run.note.start;
      pools.append(pool(amount,watching?text(key):text(run.note.mode==='missing'?'final':'initial'),amount===null));
    }
    const grid=$('answerGrid');
    // Buttons are retained while handling answers. Their values never move
    // after a wrong answer, and their targets do not jump during feedback.
    if(grid.dataset.run!==String(run.note.id)+':'+run.answers.join(',')){
      grid.replaceChildren();grid.dataset.run=String(run.note.id)+':'+run.answers.join(',');
      run.answers.forEach(value=>{const b=button('', 'respond',()=>choose(value));b.className='tide-answer';b.textContent=String(value);b.dataset.value=String(value);b.setAttribute('aria-label',text('answerLabel',{value}));grid.append(b);});
    }
    [...grid.children].forEach(b=>{const value=Number(b.dataset.value);b.disabled=watching||run.phase==='result'||run.rejected.includes(value);b.classList.toggle('is-wrong',run.rejected.includes(value));});
    $('waveBtn').disabled=!watching;$('waveBtn').textContent=text(run.step===run.steps.length-1?'respond':'watch');
    $('rewatchBtn').disabled=run.phase==='result';
    $('status').textContent=watching?text('watchHint'):run.rejected.length?hint():text('respond');
    if(!watching&&run.phase==='answer'&&document.activeElement===$('waveBtn'))grid.querySelector('button:not(:disabled)')?.focus();
  }
  function solution(note) {
    if(note.mode==='compare')return `${Math.max(note.left,note.right)} − ${Math.min(note.left,note.right)} = ${note.target}`;
    if(note.mode==='missing')return `${note.start} + ${note.target}${note.departures.map(n=>' − '+n).join('')} = ${note.final}`;
    let formula=String(note.start);
    if(note.mode==='two-step')note.arrivals.forEach((n,i)=>{formula+=' + '+n;if(note.departures[i]!==undefined)formula+=' − '+note.departures[i];});
    else {formula+=note.arrivals.map(n=>' + '+n).join('');formula+=note.departures.map(n=>' − '+n).join('');}
    if(note.interference)formula+=' − '+note.interference;
    return formula+' = '+note.target;
  }
  function openModal(kind) {
    closeModal(false);modal={kind,focus:kind==='leave'?$('battleBackBtn'):document.activeElement};$('tideModal').hidden=false;
    $('tidePlay').inert=true;sceneRoots.battle.querySelector('header').inert=true;
    const result=kind==='result', actions=$('tideModalActions');actions.replaceChildren();
    $('tideModalTitle').textContent=text(result?(progress.best.every(Boolean)?'resultTitle':'resultLevel'):'leaveTitle');
    $('tideModalText').textContent=result?text('stars',{value:4-run.checks})+' · '+text('checks',{value:run.checks}):`${text('round')} ${run.note.id} · ${text('leaveText')}`;
    $('tideSolution').textContent=result?solution(run.note):'';$('tideSolution').dir='ltr';
    $('tideSave').textContent=result?text(saved?'saved':'sessionOnly'):'';
    if(result){
      actions.append(button('resultStageBtn','stages',()=>show('stage')));
      const hasNext=run.note.id<notes.length;
      const next=button('resultNextBtn','next',()=>{if(hasNext)startNote(run.note.id);},true);next.disabled=!hasNext;actions.append(next);
      actions.append(button('resultReplayBtn','retry',()=>startNote(run.note.id-1,true)));
    }else{
      actions.append(button('keepPlayingBtn','stay',()=>closeModal(),true),button('leaveNoteBtn','stages',()=>{run=null;show('stage');}));
    }
    actions.querySelector('button').focus({preventScroll:true});
  }
  function choose(value) {
    if(scene!=='battle'||modal||!run)return;
    const correct=answer(run,value);if(correct===null)return;
    renderBattle();
    if(correct){settle(progress,run);saved=storage.set(SAVE_KEY,JSON.stringify(progress));updateProgress();sfx('feedback.success');openModal('result');}
    else {sfx('feedback.error');$('answerGrid').querySelector('button:not(:disabled)')?.focus({preventScroll:true});}
  }
  async function boot() {
    try {
      document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
      for(const name of ['game-screen-frame.css','stage-selector-standard.css','battle-canvas-standard.css'])sheet(name);
      await Promise.all([script('game-screen-frame.js',()=>window.WeightPlayScreenFrame?.mount),script('stage-virtualization-standard.js',()=>window.WeightPlayStageV6?.install)]);
      const slots=normalize();frame=window.WeightPlayScreenFrame.mount({root:app,...slots});
      stageController=window.WeightPlayStageV6.install($('stageList'),{total:notes.length,poolSize:9,bind:stageBind,initialIndex:()=>unlocked(progress),activate:index=>startNote(index)});
      if(!stageController)throw Error('Stage controller unavailable');
      listen($('startBtn'),'click',()=>show('stage'));listen($('stageBackBtn'),'click',()=>show('main'));
      listen($('battleBackBtn'),'click',()=>{if(!modal&&run?.phase!=='result')openModal('leave');});
      listen(slots.localeSelect,'change',e=>{const next=e.target.value;const route=Object.keys(routes).find(k=>routes[k]===next);if(!route)return;storage.set('weightPlayLocale',next);location.assign('/'+route+'/games/animal-tide-tally/'+location.search+location.hash);});
      listen(document,'keydown',e=>{
        if(e.defaultPrevented||scene!=='battle')return;
        if(modal){
          if(e.key==='Escape'){e.preventDefault();if(modal.kind==='leave')closeModal();else show('stage');return;}
          if(e.key==='Tab'){
            const buttons=[...$('tideModal').querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
            if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
            else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
          }
          return;
        }
        if(e.key==='Escape'){e.preventDefault();openModal('leave');}
        else if(/^[123]$/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&run?.phase==='answer'&&!e.target.closest('select,input,textarea,[contenteditable]')&&!e.target.closest('[data-wp-preferences]')){e.preventDefault();choose(run.answers[Number(e.key)-1]);}
      });
      await Promise.all([script('stage-selector-standard.js'),script('battle-canvas-standard.js')]);
      $('loading').hidden=true;app.hidden=false;show('main');
      window.dispatchEvent(new CustomEvent('wonder:locale-change'));
      // Resize changes only the shared rail's centering, never game contents.
      const resize=new ResizeObserver(()=>{if(scene==='stage')stageController.center();});resize.observe($('stageList'));
      listen(window,'pagehide',e=>{if(e.persisted)return;resize.disconnect();stageController.destroy();frame.destroy();lifecycle.abort();});
      window.__ANIMAL_TIDE_TALLY_TEST__={...model,labels,saveDetails,solution,startNote,getState:()=>({noteIndex:run?run.note.id-1:0,solved:progress.best.flatMap((n,i)=>n?[i]:[]),checks:run?.checks||0,screen:scene,phase:run?.phase,step:run?.step,feedback:run?.phase==='result'?'correct':run?.rejected.length?'wrong':'',modal:modal?.kind||null})};
    }catch(error){console.error('Tide Tally startup failed',error);$('loading').hidden=false;$('loading').textContent=text('loadError');app.hidden=true;}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}());
