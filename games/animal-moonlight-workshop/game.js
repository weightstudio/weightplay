/* Moonlight Workshop: game-owned deterministic puzzle and guided play. */
import { createMoonlightWorkshopStageConfig } from './stage-config.mjs';
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const profiles = [
    { badge:"◎", start:[0,2], switches:[[2,1],[4,3]], key:[5,1], exit:[7,2], limit:18, walls:[[1,0],[3,0],[3,2],[4,2],[4,4],[6,4]] },
    { badge:"⚙", start:[0,4], switches:[[1,3],[3,1],[5,3]], key:[6,3], exit:[7,4], limit:22, walls:[[1,2],[2,2],[4,2],[6,2],[2,1],[2,0],[4,0],[6,0],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]], gates:[{x:2,y:3,needs:1},{x:4,y:1,needs:2},{x:6,y:3,needs:3}] },
    { badge:"❄", start:[0,4], switches:[[2,4],[4,2],[6,0]], key:[7,2], exit:[7,4], limit:15, walls:[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[5,1],[6,1],[5,2],[6,2]], ice:[[1,4],[2,4],[4,3],[4,2],[4,1],[5,0],[6,0]] },
    { badge:"✦", start:[0,2], switches:[[1,1],[3,3],[6,1]], key:[6,3], exit:[7,2], limit:20, walls:[[1,2],[2,2],[3,2],[1,3],[2,3],[5,0],[6,0]], portals:[[[2,1],[5,3]]] },
    { badge:"①", start:[0,4], switches:[[2,3],[1,1],[4,3],[6,1]], key:[7,1], exit:[7,4], limit:24, ordered:true, walls:[[0,3],[0,2],[2,2],[3,2],[4,2],[6,2],[3,4],[4,4],[5,4],[6,4]] },
    { badge:"★", start:[0,4], switches:[[2,4],[3,1],[5,3],[6,1]], key:[7,0], exit:[7,4], limit:22, walls:[[0,0],[1,0],[2,0],[4,0],[5,0],[6,0],[1,3],[2,3],[4,3],[6,3],[1,2],[2,2],[4,2],[6,2]], gates:[{x:3,y:3,needs:1},{x:7,y:2,needs:4}], ice:[[1,4],[2,4]], portals:[[[4,1],[5,3]]] },
  ];
  // Every locale owns the same compact instruction and feedback vocabulary.
  const words = {
    en: ['Light switches','Collect the key','Reach the door','Undo','Show a step','Moves left','Use arrows / WASD, or tap a neighbouring tile.','Walls and closed gates block movement. No move spent.','Light switches in number order.','All switches lit! The key is ready.','Key collected! Head for the glowing door.','Out of moves. Try a different route; your unlocked rooms are safe.','No route within the remaining moves. Undo or retry.','Your next step','Room cleared','Rooms cleared','Switches → key → door. Take your time; only steps count.','Leave this room? Your current route will reset. Unlocked rooms stay saved.','Keep playing','Return to rooms','No rush · plan before moving', 'First lights|Gear gates|Ice rails|Portal passage|Number sequence|Moonlight finale','Walk onto both switches. Lit switches stay on.|A gate opens when its number of switches is lit.|Ice keeps you sliding. Each crossed tile costs a move.|Matching portals transport you instantly.|Light switches 1 → 2 → 3 → 4.|Combine ice, gates and portals to escape.','Switch','Key','Door','You','Wall','Gate','Ice','Portal','Route restored.','Route reset.'],
    'zh-Hant': ['點亮開關','取得鑰匙','抵達出口','退一步','提示一步','剩餘步數','按方向鍵／WASD，或點角色旁的格子移動。','前方是牆或未開的門閘，不扣步數。','請依數字順序點亮開關。','開關全亮了！現在去拿鑰匙。','拿到鑰匙！走向發光的出口。','步數用完了。換條路再試，已解鎖房間會保留。','剩餘步數無法抵達出口，請退一步或重試。','下一步','房間修復完成','已通過房間','開關 → 鑰匙 → 出口。不用搶快，移動才計步。','要離開這個房間嗎？本次路線會重設，已解鎖的房間會保留。','繼續解謎','返回房間','沒有倒數 · 想好再走','初亮的機關|齒輪門閘|冰軌滑行|傳送迴廊|順序電路|月光終章','走到兩個開關上，點亮後不會熄滅。|門閘上的數字代表需要點亮幾個開關。|踏上冰軌會沿直線滑行，經過每格都計步。|走進同字母的傳送門，會立即移到另一端。|依序走到開關 1 → 2 → 3 → 4。|結合冰軌、門閘與傳送門，修復最後的電路。','開關','鑰匙','出口','你在這裡','牆壁','門閘','冰軌','傳送門','已回到上一步。','路線已重設。'],
    'zh-Hans': ['点亮开关','取得钥匙','抵达出口','退一步','提示一步','剩余步数','按方向键／WASD，或点角色旁的格子移动。','前方是墙或未开的门闸，不扣步数。','请依数字顺序点亮开关。','开关全亮了！现在去拿钥匙。','拿到钥匙！走向发光的出口。','步数用完了。换条路再试，已解锁房间会保留。','剩余步数无法抵达出口，请退一步或重试。','下一步','房间修复完成','已通过房间','开关 → 钥匙 → 出口。不用抢快，移动才计步。','要离开这个房间吗？本次路线会重设，已解锁的房间会保留。','继续解谜','返回房间','没有倒数 · 想好再走','初亮的机关|齿轮门闸|冰轨滑行|传送回廊|顺序电路|月光终章','走到两个开关上，点亮后不会熄灭。|门闸上的数字代表需要点亮几个开关。|踏上冰轨会沿直线滑行，经过每格都计步。|走进同字母的传送门，会立即移到另一端。|依序走到开关 1 → 2 → 3 → 4。|结合冰轨、门闸与传送门，修复最后的电路。','开关','钥匙','出口','你在这里','墙壁','门闸','冰轨','传送门','已回到上一步。','路线已重设。'],
    ja: ['スイッチを点灯','鍵を取る','出口へ進む','一手戻す','次の一手','残り歩数','矢印／WASD、または隣のマスをタップ。','壁や閉じたゲートです。歩数は減りません。','番号順に点灯してください。','全点灯！鍵を取りに行こう。','鍵を入手！光る出口へ。','歩数切れ。別の道を試そう。解放した部屋は残ります。','残り歩数では脱出できません。戻すかリトライ。','次の一手','部屋の修復完了','クリアした部屋','スイッチ → 鍵 → 出口。時間制限はありません。','この部屋を離れますか？今の道順はリセットされます。解放した部屋は残ります。','続ける','部屋へ戻る','急がず · 考えて進もう','最初の灯り|歯車ゲート|氷のレール|転送の回廊|番号の回路|月光の終章','2つのスイッチに乗ろう。点灯は消えません。|ゲートの数字と同じ数のスイッチを点灯。|氷では直進します。通ったマスごとに1歩。|同じ文字のポータルは一対です。|1 → 2 → 3 → 4の順に点灯。|氷・ゲート・転送を組み合わせよう。','スイッチ','鍵','出口','現在地','壁','ゲート','氷','ポータル','一手戻しました。','道順をリセット。'],
    ko: ['스위치 켜기','열쇠 얻기','출구 도착','한 수 취소','한 수 힌트','남은 걸음','방향키 / WASD 또는 옆 칸을 누르세요.','벽이나 닫힌 문입니다. 걸음은 줄지 않아요.','번호 순서대로 스위치를 켜세요.','모두 켰어요! 열쇠를 찾으세요.','열쇠 획득! 빛나는 출구로 가세요.','걸음을 다 썼어요. 다른 경로를 시도하세요. 열린 방은 유지됩니다.','남은 걸음으로 탈출할 수 없어요. 취소하거나 다시 하세요.','다음 한 수','방 수리 완료','완료한 방','스위치 → 열쇠 → 출구. 시간제한은 없어요.','방을 떠날까요? 현재 경로는 초기화되지만 열린 방은 유지됩니다.','계속하기','방으로 돌아가기','서두르지 말고 생각하세요','첫 불빛|톱니 문|얼음 길|순간이동 통로|번호 회로|달빛의 피날레','두 스위치를 밟으세요. 켜진 불은 유지돼요.|문 숫자만큼 스위치를 켜세요.|얼음에서는 직진해요. 지난 칸마다 한 걸음.|같은 문자의 포털은 연결되어 있어요.|1 → 2 → 3 → 4 순서로 켜세요.|얼음, 문, 포털을 조합하세요.','스위치','열쇠','출구','현재 위치','벽','문','얼음','포털','한 수 되돌렸어요.','경로를 초기화했어요.'],
    es: ['Activa interruptores','Recoge la llave','Llega a la puerta','Deshacer','Ver un paso','Pasos restantes','Flechas / WASD, o toca una casilla vecina.','Muro o puerta cerrada. No gastas pasos.','Activa los interruptores por orden.','¡Todos activos! Recoge la llave.','¡Llave recogida! Ve a la puerta iluminada.','Sin pasos. Prueba otra ruta; las salas desbloqueadas se conservan.','No quedan pasos suficientes. Deshaz o reintenta.','Siguiente paso','Sala reparada','Salas completadas','Interruptores → llave → puerta. Sin límite de tiempo.','¿Salir? La ruta actual se reinicia. Las salas desbloqueadas se conservan.','Seguir jugando','Volver a salas','Sin prisa · piensa antes de moverte','Primeras luces|Puertas de engranajes|Rieles de hielo|Pasaje de portales|Circuito numerado|Final lunar','Pisa ambos interruptores. Permanecen encendidos.|Activa tantos interruptores como indica la puerta.|El hielo te desliza en línea recta. Cada casilla cuesta un paso.|Los portales con la misma letra están conectados.|Activa 1 → 2 → 3 → 4.|Combina hielo, puertas y portales.','Interruptor','Llave','Puerta','Tú','Muro','Compuerta','Hielo','Portal','Paso restaurado.','Ruta reiniciada.'],
    'pt-BR': ['Acenda interruptores','Pegue a chave','Alcance a porta','Desfazer','Ver um passo','Passos restantes','Setas / WASD, ou toque numa casa vizinha.','Parede ou portão fechado. Nenhum passo gasto.','Acenda os interruptores em ordem.','Todos acesos! Pegue a chave.','Chave coletada! Vá à porta iluminada.','Sem passos. Tente outra rota; salas abertas ficam salvas.','Passos insuficientes. Desfaça ou tente de novo.','Próximo passo','Sala restaurada','Salas concluídas','Interruptores → chave → porta. Sem limite de tempo.','Sair? A rota atual será reiniciada. Salas abertas ficam salvas.','Continuar','Voltar às salas','Sem pressa · pense antes de andar','Primeiras luzes|Portões mecânicos|Trilhos de gelo|Passagem de portais|Circuito numerado|Final lunar','Pise nos dois interruptores. Ficam acesos.|Acenda a quantidade indicada no portão.|O gelo faz deslizar em linha reta. Cada casa custa um passo.|Portais com a mesma letra estão ligados.|Acenda 1 → 2 → 3 → 4.|Combine gelo, portões e portais.','Interruptor','Chave','Porta','Você','Parede','Portão','Gelo','Portal','Passo restaurado.','Rota reiniciada.'],
    fr: ['Allume les boutons','Prends la clé','Rejoins la porte','Annuler','Voir un pas','Pas restants','Flèches / WASD, ou touche une case voisine.','Mur ou portail fermé. Aucun pas dépensé.','Allume les boutons dans l’ordre.','Tout est allumé ! Prends la clé.','Clé récupérée ! Rejoins la porte lumineuse.','Plus de pas. Essaie un autre chemin ; les salles ouvertes restent acquises.','Pas insuffisants. Annule ou réessaie.','Prochain pas','Salle réparée','Salles terminées','Boutons → clé → porte. Pas de limite de temps.','Quitter ? Le chemin actuel sera réinitialisé. Les salles ouvertes restent acquises.','Continuer','Retour aux salles','Sans pression · réfléchis avant d’avancer','Premières lumières|Portes à engrenages|Rails de glace|Passage de portails|Circuit numéroté|Final lunaire','Marche sur les deux boutons. Ils restent allumés.|Allume autant de boutons que le nombre sur la porte.|La glace fait glisser tout droit. Chaque case coûte un pas.|Les portails de même lettre sont reliés.|Allume 1 → 2 → 3 → 4.|Combine glace, portes et portails.','Bouton','Clé','Porte','Toi','Mur','Portail fermé','Glace','Portail','Pas annulé.','Chemin réinitialisé.'],
    de: ['Schalter aktivieren','Schlüssel holen','Tür erreichen','Zurück','Nächster Schritt','Schritte übrig','Pfeile / WASD oder ein Nachbarfeld antippen.','Wand oder geschlossenes Tor. Kein Schritt verbraucht.','Schalter in Zahlenfolge aktivieren.','Alle aktiv! Hole den Schlüssel.','Schlüssel erhalten! Zur leuchtenden Tür.','Keine Schritte mehr. Versuche einen anderen Weg; offene Räume bleiben erhalten.','Nicht genug Schritte. Gehe zurück oder versuche es erneut.','Nächster Schritt','Raum repariert','Räume geschafft','Schalter → Schlüssel → Tür. Kein Zeitlimit.','Verlassen? Der aktuelle Weg wird zurückgesetzt. Offene Räume bleiben erhalten.','Weiterspielen','Zur Raumauswahl','Ohne Zeitdruck · erst planen','Erstes Licht|Zahnradtore|Eisschienen|Portalgang|Zahlenkreis|Mondlichtfinale','Betritt beide Schalter. Sie bleiben aktiv.|Aktiviere so viele Schalter wie die Torzahl.|Auf Eis rutschst du geradeaus. Jedes Feld zählt.|Portale mit gleichem Buchstaben sind verbunden.|Aktiviere 1 → 2 → 3 → 4.|Kombiniere Eis, Tore und Portale.','Schalter','Schlüssel','Tür','Du','Wand','Tor','Eis','Portal','Schritt zurückgenommen.','Weg zurückgesetzt.'],
    it: ['Accendi interruttori','Prendi la chiave','Raggiungi la porta','Annulla','Mostra un passo','Passi rimasti','Frecce / WASD oppure tocca una casella vicina.','Muro o cancello chiuso. Nessun passo speso.','Accendi gli interruttori in ordine.','Tutti accesi! Prendi la chiave.','Chiave presa! Vai alla porta luminosa.','Passi esauriti. Prova un altro percorso; le stanze aperte restano salvate.','Passi insufficienti. Annulla o riprova.','Prossimo passo','Stanza riparata','Stanze completate','Interruttori → chiave → porta. Nessun limite di tempo.','Uscire? Il percorso attuale verrà azzerato. Le stanze aperte restano salvate.','Continua','Torna alle stanze','Nessuna fretta · pensa prima di muoverti','Prime luci|Cancelli meccanici|Binari di ghiaccio|Passaggio di portali|Circuito numerato|Finale lunare','Passa sui due interruttori. Restano accesi.|Accendi tanti interruttori quanti indicati dal cancello.|Il ghiaccio fa scivolare in linea retta. Ogni casella costa un passo.|I portali con la stessa lettera sono collegati.|Accendi 1 → 2 → 3 → 4.|Combina ghiaccio, cancelli e portali.','Interruttore','Chiave','Porta','Tu','Muro','Cancello','Ghiaccio','Portale','Passo annullato.','Percorso azzerato.'],
    ru: ['Включите кнопки','Возьмите ключ','Дойдите до двери','Отменить','Подсказка шага','Осталось шагов','Стрелки / WASD или нажмите соседнюю клетку.','Стена или закрытые ворота. Шаг не потрачен.','Включайте кнопки по порядку.','Все включены! Возьмите ключ.','Ключ получен! К светящейся двери.','Шаги закончились. Попробуйте другой путь; открытые комнаты сохранятся.','Шагов недостаточно. Отмените ход или начните снова.','Следующий шаг','Комната восстановлена','Пройдено комнат','Кнопки → ключ → дверь. Без ограничения времени.','Выйти? Текущий путь сбросится. Открытые комнаты сохранятся.','Продолжить','К комнатам','Не спешите · сначала подумайте','Первый свет|Зубчатые ворота|Ледяные рельсы|Портальный проход|Числовая цепь|Лунный финал','Наступите на обе кнопки. Они останутся включены.|Включите столько кнопок, сколько указано на воротах.|Лёд скользит по прямой. Каждая клетка стоит шаг.|Порталы с одной буквой связаны.|Включите 1 → 2 → 3 → 4.|Совместите лёд, ворота и порталы.','Кнопка','Ключ','Дверь','Вы','Стена','Ворота','Лёд','Портал','Шаг отменён.','Путь сброшен.'],
    hi: ['स्विच जलाएँ','चाबी लें','दरवाज़े तक पहुँचें','चाल वापस','एक कदम संकेत','शेष कदम','तीर / WASD या पास वाला खाना दबाएँ।','दीवार या बंद गेट है। कदम नहीं कटा।','स्विच संख्या के क्रम में जलाएँ।','सब जल गए! अब चाबी लें।','चाबी मिल गई! चमकते दरवाज़े पर जाएँ।','कदम खत्म। दूसरा रास्ता आज़माएँ; खुले कमरे सुरक्षित हैं।','कदम पर्याप्त नहीं। चाल वापस लें या फिर प्रयास करें।','अगला कदम','कमरा ठीक हुआ','पूरे हुए कमरे','स्विच → चाबी → दरवाज़ा। समय सीमा नहीं।','बाहर जाएँ? मौजूदा रास्ता रीसेट होगा। खुले कमरे सुरक्षित रहेंगे।','खेलते रहें','कमरों पर लौटें','जल्दी नहीं · सोचकर चलें','पहली रोशनी|गियर गेट|बर्फ की पटरी|पोर्टल मार्ग|संख्या सर्किट|चाँदनी समापन','दोनों स्विच पर चलें। जलने के बाद वे चालू रहते हैं।|गेट के अंक जितने स्विच जलाएँ।|बर्फ पर सीधे फिसलते हैं। हर खाने का एक कदम।|एक अक्षर वाले पोर्टल जुड़े हैं।|1 → 2 → 3 → 4 क्रम में जलाएँ।|बर्फ, गेट और पोर्टल को मिलाएँ।','स्विच','चाबी','दरवाज़ा','आप','दीवार','गेट','बर्फ','पोर्टल','चाल वापस ली।','रास्ता रीसेट हुआ।'],
    ar: ['أضئ المفاتيح','التقط المفتاح','صل إلى الباب','تراجع','تلميح خطوة','الخطوات المتبقية','الأسهم / WASD أو المس مربعاً مجاوراً.','جدار أو بوابة مغلقة. لم تُستهلك خطوة.','أضئ المفاتيح بترتيب الأرقام.','أُضيئت كلها! التقط المفتاح.','التقطت المفتاح! اتجه إلى الباب المضيء.','انتهت الخطوات. جرّب طريقاً آخر؛ الغرف المفتوحة محفوظة.','الخطوات غير كافية. تراجع أو أعد المحاولة.','الخطوة التالية','تم إصلاح الغرفة','الغرف المكتملة','المفاتيح ← المفتاح ← الباب. لا يوجد حد زمني.','هل تريد المغادرة؟ سيُعاد المسار الحالي. الغرف المفتوحة محفوظة.','متابعة اللعب','العودة إلى الغرف','لا داعي للعجلة · خطط أولاً','الأضواء الأولى|بوابات التروس|مسارات الجليد|ممر البوابات|دائرة الأرقام|ختام ضوء القمر','قف على المفتاحين. سيبقيان مضاءين.|أضئ عدد المفاتيح المكتوب على البوابة.|الجليد يزلقك بخط مستقيم. كل مربع يكلف خطوة.|البوابات بنفس الحرف متصلة.|أضئ حسب الترتيب 1 ثم 2 ثم 3 ثم 4.|اجمع بين الجليد والبوابات والانتقال.','مفتاح ضوء','مفتاح الباب','الباب','أنت','جدار','بوابة','جليد','بوابة انتقال','تم التراجع عن الخطوة.','أُعيد المسار.']
  };
  const t = index => (words[window.WeightPlayMarketFiveLocale?.locale] || words.en)[index];
  const common = index => window.wpMarketCommon(index);
  const names = () => t(21).split('|');
  const mechanics = () => t(22).split('|');
  const key = 'weightplay-moonlight-workshop-best-stage';
  const recordsKey = 'weightplay-moonlight-workshop-routes-v1';
  const read = (name, fallback) => { try { return localStorage.getItem(name) ?? fallback; } catch { return fallback; } };
  const save = (name, value) => { try { localStorage.setItem(name, value); } catch { /* Play remains available without storage. */ } };
  let best = Math.max(0, Math.min(profiles.length, Math.floor(Number(read(key, '0')) || 0)));
  let records; try { records = JSON.parse(read(recordsKey, '{}')); } catch { records = {}; }
  if (!records || typeof records !== 'object' || Array.isArray(records)) records = {};
  let selectedStageIndex = Math.min(profiles.length - 1, best);
  const stageConfig = createMoonlightWorkshopStageConfig({profiles,getState:()=>({
    best, records, names:names(), mechanics:mechanics(), stageLabel:common(9), bestLabel:common(8),
    switchLabel:t(23), moveLabel:t(5),
  })});
  let stageSelector = null;
  let screen = 'main', stage = 1, game, history = [], hinted = null, notice = '', resultWin = false, leaving = false;
  window.addEventListener('weightplay:castle-reward',event=>{
    if(event.detail?.gameId==='animal-moonlight-workshop'&&screen==='result')queueMicrotask(()=>{
      if(screen==='result')window.WeightPlayCastle?.dismissRewardNotice?.('animal-moonlight-workshop');
    });
  });
  const directions = {up:[0,-1,'↑',16],left:[-1,0,'←',17],down:[0,1,'↓',18],right:[1,0,'→',19]};
  const audio = window.WeightPlayAudio?.createScope();
  const effects = new Set();
  const settleEffects = () => {for(const effect of effects){effect.animation.cancel();effect.node.remove();}effects.clear();};
  const sound = id => audio?.play(id);
  window.WeightPlayAudio?.preload(['game.start','board.move','mechanism.unlock','reward.collect','feedback.error','feedback.hint','result.win','result.lose']);
  const portrait = () => matchMedia('(orientation: portrait)').matches;
  const camera = {up:'left',right:'up',down:'right',left:'down'};
  const toWorld = d => portrait() ? camera[d] : d;
  const toScreen = d => portrait() ? Object.keys(camera).find(k=>camera[k]===d) : d;
  const tilePosition = (x,y) => portrait() ? [4-y,x] : [x,y];
  const at = (cells, x, y) => Boolean(cells?.some(cell => cell[0] === x && cell[1] === y));
  const allMask = profile => (1 << profile.switches.length) - 1;
  const count = mask => mask.toString(2).replaceAll('0','').length;
  const initial = profile => ({x:profile.start[0], y:profile.start[1], mask:0, taken:false, steps:0});
  const won = (g,p) => g.taken && at([p.exit],g.x,g.y);

  // One pure transition owns keyboard, touch, undo snapshots and the hint search.
  // Ice charges each crossed tile; a portal transfer costs no extra step.
  function transition(before, direction, profile) {
    const g = {...before}, [dx,dy] = directions[direction], path = [];
    let rejected = false;
    function step() {
      const x = g.x + dx, y = g.y + dy;
      const gate = profile.gates?.find(cell => cell.x === x && cell.y === y);
      if (x < 0 || x > 7 || y < 0 || y > 4 || at(profile.walls,x,y) || (gate && count(g.mask) < gate.needs)) return false;
      g.x=x; g.y=y; g.steps++; path.push([x,y]);
      const switchIndex = profile.switches.findIndex(cell => cell[0]===x && cell[1]===y);
      if (switchIndex >= 0 && !(g.mask & (1 << switchIndex))) {
        const next = profile.switches.findIndex((_,i) => !(g.mask & (1 << i)));
        if (!profile.ordered || switchIndex === next) g.mask |= 1 << switchIndex;
        else rejected = true;
      }
      const portal = profile.portals?.find(pair => at(pair,g.x,g.y));
      if (portal) {
        [g.x,g.y] = portal.find(cell => cell[0]!==g.x || cell[1]!==g.y);
        path.push([g.x,g.y]);
        const landed = profile.switches.findIndex(cell => cell[0]===g.x && cell[1]===g.y);
        const next = profile.switches.findIndex((_,i) => !(g.mask & (1 << i)));
        if (landed >= 0 && (!profile.ordered || landed === next)) g.mask |= 1 << landed;
      }
      return true;
    }
    if (!step()) return null;
    let coast = 0;
    while (at(profile.ice,g.x,g.y) && coast++ < 8) if (!step()) break;
    if (g.mask === allMask(profile) && at([profile.key],g.x,g.y)) g.taken = true;
    return {game:g, path, rejected};
  }

  // Weighted shortest path: the state space is bounded by 40 cells × switch
  // masks × key state. Hints reveal a single direction, never execute a move.
  function solve(start, profile) {
    const id = g => `${g.x},${g.y},${g.mask},${Number(g.taken)}`;
    const frontier = [{g:{...start}, route:[]}], costs = new Map([[id(start),start.steps]]);
    while (frontier.length) {
      frontier.sort((a,b) => b.g.steps-a.g.steps);
      const node = frontier.pop();
      if (node.g.steps !== costs.get(id(node.g))) continue;
      if (won(node.g,profile)) return node.route;
      if (node.g.steps >= profile.limit) continue;
      for (const direction of Object.keys(directions)) {
        const next = transition(node.g,direction,profile);
        if (!next || next.game.steps > profile.limit) continue;
        const identity = id(next.game);
        if (costs.has(identity) && costs.get(identity) <= next.game.steps) continue;
        costs.set(identity,next.game.steps);
        frontier.push({g:next.game,route:[...node.route,direction]});
      }
    }
    return null;
  }

  const objective = document.createElement('section');
  objective.id = 'workshop-objective';
  objective.innerHTML = '<div class="workshop-checklist first-steps"></div><p class="workshop-mission"></p>';
  $('battle-status').replaceWith(objective);
  const board = document.createElement('div');
  board.id = 'workshop-board'; board.setAttribute('role','group');
  const grid = document.createElement('div'); grid.className='workshop-grid'; grid.dir='ltr';
  const cells = Array.from({length:40},(_,i) => {
    const button = document.createElement('button');
    button.type='button'; button.className='workshop-cell'; button.dataset.cell=String(i);
    button.addEventListener('click',() => {
      if (!canAct()) return;
      const dx=i%8-game.x, dy=Math.floor(i/8)-game.y;
      const direction = Object.keys(directions).find(d => directions[d][0]===dx && directions[d][1]===dy);
      if (direction) move(toScreen(direction)); else feedback(t(6));
    });
    grid.append(button); return button;
  });
  const player = document.createElement('img');
  player.className='workshop-player'; player.src='../../assets/weightplay-character-gear-horn-rhino-cutout.webp'; player.alt='';
  grid.append(player); board.append(grid);
  $('arena').hidden=true; $('arena').setAttribute('aria-hidden','true');
  $('arena').after(board);
  const feedbackNode = document.createElement('p'); feedbackNode.id='workshop-feedback';
  feedbackNode.setAttribute('role','status'); feedbackNode.setAttribute('aria-live','polite'); feedbackNode.setAttribute('aria-atomic','true');
  $('battle-controls').before(feedbackNode);
  const dialog = document.createElement('dialog'); dialog.className='workshop-leave';
  dialog.setAttribute('aria-labelledby','workshop-leave-copy');
  dialog.innerHTML='<p id="workshop-leave-copy"></p><button type="button" id="workshop-stay"></button><button type="button" id="workshop-leave"></button>';
  $('battle-screen').append(dialog);
  const controlHost = $('battle-controls');
  controlHost.innerHTML = '<div class="workshop-tools"><button id="workshop-undo" type="button"></button><button id="workshop-hint" type="button"></button><button id="workshop-reset" type="button">↺</button></div><div class="workshop-pad" dir="ltr"></div>';
  for (const [direction,values] of Object.entries(directions)) {
    const button = document.createElement('button'); button.type='button'; button.dataset.action=`move-${direction}`;
    button.textContent=values[2]; button.className=`workshop-direction ${direction}`;
    button.addEventListener('click',() => move(direction));
    controlHost.querySelector('.workshop-pad').append(button);
  }
  const frame = window.WeightPlayScreenFrame.mount({
    root:$('app'),localeSelect:$('localeSelect'),playUI:true,
    scenes:{
      main:{root:$('main-screen'),header:$('main-screen').querySelector('header'),content:$('main-content')},
      stage:{root:$('stage-screen'),header:$('stage-screen').querySelector('header'),content:$('stage-content')},
      battle:{root:$('battle-screen'),header:$('battle-screen').querySelector('header'),content:$('battle-content'),headerInfo:$('battle-info')},
    },
  });
  const stageProgress = document.createElement('span');
  const stageInfoGroup = window.WeightPlayScreenFrame.createGroup().add(stageProgress);
  frame.stageTopUI.add(stageInfoGroup);
  const stageTab = $('stageTabButton');
  frame.commonDownButton.add(stageTab);
  stageTab.addEventListener('click',()=>stageSelector?.select(selectedStageIndex,{center:true,focus:false,notify:false}));
  const battleInfoGroup = window.WeightPlayScreenFrame.createGroup().add($('stage-label')).add($('score-label'));
  frame.battleTopUI.add(battleInfoGroup);
  function updateStageProgress() {
    stageProgress.textContent = `${common(9)} ${selectedStageIndex+1} / ${profiles.length} · ${t(15)} ${best} / ${profiles.length}`;
  }
  function ensureStageSelector() {
    if (stageSelector) return stageSelector;
    stageSelector = window.WeightPlayPlayUI.mountStage({
      page:$('stage-content'),rail:$('stage-list'),config:stageConfig,selected:selectedStageIndex,
      isActive:()=>screen==='stage',
      onSelect(index){selectedStageIndex=index;updateStageProgress();},
      onStart(index){start(index+1);},
    });
    return stageSelector;
  }
  const measure = {screen:'main',roundKey:null,started:false,ended:false,restart:false,outcome:'complete'};
  const observe = () => { try { window.WonderAnalytics?.game?.observeState(() => ({...measure,screen:screen==='battle'&&!leaving?'battle':screen==='main'||screen==='stage'?screen:null,paused:leaving||Boolean(document.querySelector('.wp-shell-settings-popover:not([hidden])')),node:document.body,activityMode:'input',idleSeconds:300,keyboardKeys:['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d']})); } catch { /* Optional local telemetry. */ } };
  window.addEventListener('weightplay:analytics-ready',observe);
  function feedback(message) {
    notice=message; feedbackNode.textContent=message;
    feedbackNode.getAnimations().forEach(a => a.cancel());
    feedbackNode.animate([{opacity:.35},{opacity:1}],{duration:180});
  }
  function show(next) {
    settleEffects(); grid.getAnimations({subtree:true}).forEach(a=>a.cancel());
    if(next!=='result')window.WeightPlayCastle?.dismissRewardNotice?.('animal-moonlight-workshop');
    audio?.stop(); screen=next; leaving=false; if (dialog.open) dialog.close();
    document.body.dataset.screen = next==='result'?'battle':next;
    document.querySelector('[data-wp-game-guide]')?.toggleAttribute('hidden',next!=='main');
    for (const node of document.querySelectorAll('.screen')) {
      const active = node.id==='battle-screen' ? next==='battle'||next==='result' : node.dataset.screen===next;
      node.hidden=!active; node.classList.toggle('active',active);
    }
    $('result-screen').hidden=next!=='result';
    board.inert=next!=='battle'; controlHost.inert=next!=='battle'; objective.inert=next!=='battle';
    $('battle-screen').classList.toggle('workshop-settled',next==='result');
    frame.activate(next==='result'?'battle':next);
    if(next==='stage'){
      ensureStageSelector().refresh(selectedStageIndex);
      updateStageProgress();
    }
    window.dispatchEvent(new CustomEvent(next==='battle'?'weightplay:battle-open':'weightplay:shell-sync'));
    observe();
  }
  function localize() {
    document.querySelector('[data-m5-lede]').textContent=t(16);
    stageTab.textContent=common(2);
    $('main-progress').textContent=`${t(15)}: ${best} / ${profiles.length}`;
    $('workshop-undo').textContent=`↶ ${t(3)}`;
    $('workshop-hint').textContent=`◇ ${t(4)}`;
    $('workshop-reset').setAttribute('aria-label',common(5));
    for (const [d,v] of Object.entries(directions)) controlHost.querySelector(`[data-action="move-${d}"]`).setAttribute('aria-label',common(v[3]));
    $('workshop-stay').textContent=t(18); $('workshop-leave').textContent=t(19);
    $('workshop-leave-copy').textContent=`${common(9)} ${stage}. ${t(17)}`;
    document.querySelector('[data-m5-guide]').textContent=t(6);
    if(stageSelector)stageSelector.refresh(selectedStageIndex);
    updateStageProgress();
    frame.refresh();
    if(game) render();
  }
  function start(n,replay=false) {
    if (n<1 || n>Math.min(profiles.length,best+1)) return;
    selectedStageIndex=n-1;
    stageSelector?.select(selectedStageIndex,{center:true,notify:false});
    updateStageProgress();
    stage=n; game=initial(profiles[n-1]); history=[]; hinted=null; notice=''; resultWin=false;
    $('stage-label').textContent=`${common(9)} ${stage} / ${profiles.length}`;
    measure.roundKey={}; measure.started=true; measure.ended=false; measure.restart=replay; measure.outcome='complete';
    show('battle'); render(); feedback(mechanics()[stage-1]);
    sound('game.start');
  }
  function canAct() {
    return screen==='battle'&&!leaving&&!document.hidden&&!document.querySelector('dialog[open],.wp-shell-settings-popover:not([hidden])');
  }
  function move(direction) {
    if (!canAct()) return;
    const p=profiles[stage-1], next=transition(game,toWorld(direction),p);
    if (!next) { feedback(t(7)); sound('feedback.error'); return; }
    history.push({...game}); if(history.length>80)history.shift();
    const before=game; game=next.game; hinted=null;
    render();
    if(game.taken&&!before.taken){feedback(t(10));collectKey();sound('reward.collect');}
    else if(game.mask===allMask(p)&&before.mask!==game.mask){feedback(t(9));sound('mechanism.unlock');}
    else if(next.rejected){feedback(t(8));sound('feedback.error');}
    else if(game.mask!==before.mask){feedback(`${t(0)} · ${count(game.mask)}/${p.switches.length}`);sound('mechanism.unlock');}
    else { feedback(mechanics()[stage-1]); sound('board.move'); }
    if(won(game,p)) finish(true);
    else if(game.steps>=p.limit) finish(false);
  }
  function collectKey() {
    const p=profiles[stage-1], from=cells[p.key[1]*8+p.key[0]].getBoundingClientRect();
    const destination=objective.querySelector('.workshop-task:nth-child(2)').getBoundingClientRect();
    const shell=$('battle-screen'), bounds=shell.getBoundingClientRect(), scale=bounds.width/shell.offsetWidth;
    const node=document.createElement('span');node.className='workshop-key-flight';
    Object.assign(node.style,{left:`${(from.x-bounds.x)/scale}px`,top:`${(from.y-bounds.y)/scale}px`,width:`${from.width/scale}px`,height:`${from.height/scale}px`});
    shell.append(node);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animation=node.animate(reduced?[{opacity:1},{opacity:0}]:[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${(destination.x+destination.width/2-from.x-from.width/2)/scale}px,${(destination.y+destination.height/2-from.y-from.height/2)/scale}px) scale(.3)`,opacity:0}],{duration:reduced?100:380,easing:'ease-in'});
    const effect={node,animation};effects.add(effect);animation.finished.catch(()=>{}).then(()=>{node.remove();effects.delete(effect);});
  }
  function undoMove() {
    if(!canAct()||!history.length)return;
    settleEffects(); game=history.pop(); hinted=null; render(); feedback(t(31));
  }
  function hint() {
    if(!canAct())return;
    const route=solve(game,profiles[stage-1]);
    hinted=route?.[0]?toScreen(route[0]):null; render();
    feedback(hinted?`${t(13)}: ${directions[hinted][2]} ${common(directions[hinted][3])}`:t(12)); sound('feedback.hint');
  }
  function finish(win) {
    resultWin=win;
    if(win){best=Math.max(best,stage);save(key,String(best));const old=Number(records[stage]);records[stage]=Number.isFinite(old)&&old>0?Math.min(old,game.steps):game.steps;save(recordsKey,JSON.stringify(records));}
    measure.ended=true; measure.outcome=win?'win':'lose';
    $('result-title').textContent=win?t(14):common(11);
    $('result-copy').textContent=win?`${names()[stage-1]} · ${game.steps} / ${profiles[stage-1].limit} · ${count(game.mask)}/${profiles[stage-1].switches.length} ${t(23)}`:t(11);
    $('next').disabled=!win||stage>=profiles.length; $('next').setAttribute('aria-disabled',String($('next').disabled));
    localize(); show('result'); sound(win?'result.win':'result.lose');
    if(win) window.WeightPlayCastle?.dismissRewardNotice?.('animal-moonlight-workshop');
    $('retry').focus({preventScroll:true});
  }
  function render() {
    const p=profiles[stage-1], lit=count(game.mask), phase=game.taken?2:game.mask===allMask(p)?1:0;
    const mission=phase===0?`${t(0)} · ${lit}/${p.switches.length}`:t(phase);
    objective.querySelector('.workshop-checklist').replaceChildren(...[0,1,2].map((step) => {
      const item=document.createElement('div'); item.className=`workshop-task${step===phase?' current':''}${step<phase?' done':''}`;
      const num=document.createElement('b'); num.textContent=step<phase?'✓':String(step+1);
      const label=document.createElement('span'); label.textContent=t(step); item.append(num,label); return item;
    }));
    objective.querySelector('.workshop-mission').textContent=mission;
    $('score-label').textContent=`${t(5)} ${Math.max(0,p.limit-game.steps)}`;
    $('score-label').classList.toggle('workshop-low',p.limit-game.steps<=4);
    $('workshop-undo').disabled=!history.length;
    board.setAttribute('aria-label',`${names()[stage-1]}. ${mission}. ${t(26)}: ${game.x+1}, ${game.y+1}`);
    cells.forEach((cell,i) => {
      const x=i%8,y=Math.floor(i/8), s=p.switches.findIndex(v=>v[0]===x&&v[1]===y), gate=p.gates?.find(v=>v.x===x&&v.y===y), portal=p.portals?.findIndex(pair=>at(pair,x,y))??-1;
      const wall=at(p.walls,x,y), ice=at(p.ice,x,y), isKey=at([p.key],x,y), exit=at([p.exit],x,y), active=s>=0&&Boolean(game.mask&(1<<s));
      const target=phase===0?s>=0&&!active&&(!p.ordered||s===p.switches.findIndex((_,idx)=>!(game.mask&(1<<idx)))):phase===1?isKey:exit;
      const adjacent=Math.abs(game.x-x)+Math.abs(game.y-y)===1;
      const [col,row]=tilePosition(x,y); cell.style.gridColumn=col+1; cell.style.gridRow=row+1;
      cell.className=`workshop-cell${wall?' wall':''}${ice?' ice':''}${s>=0?' switch':''}${active?' lit':''}${target?' target':''}${adjacent&&!wall?' adjacent':''}${gate&&lit<gate.needs?' closed':''}`;
      const labels=[`${x+1}, ${y+1}`];
      let sprite=-1, badge='';
      if(wall){sprite=6; labels.push(t(27));}
      if(ice)labels.push(t(29));
      if(portal>=0){badge=String.fromCharCode(65+portal); labels.push(`${t(30)} ${badge}`);cell.classList.add('portal');}
      if(gate){badge=lit>=gate.needs?'✓':String(gate.needs);labels.push(`${t(28)} ${gate.needs}`);cell.classList.add('gate');}
      if(s>=0){sprite=1+s%3;badge=String(s+1);labels.push(`${t(23)} ${s+1}${active?' ✓':''}`);}
      if(isKey&&!game.taken){sprite=0;labels.push(t(24));if(phase===0)cell.classList.add('dormant');}
      if(exit){sprite=game.taken?5:4;labels.push(t(25));}
      cell.replaceChildren();
      if(sprite>=0){const icon=document.createElement('span');icon.className='workshop-sprite';icon.style.backgroundPosition=`${(sprite%4)*100/3}% ${sprite<4?'0':'100'}%`;cell.append(icon);}
      if(badge){const tag=document.createElement('span');tag.className='workshop-tile-badge';tag.textContent=badge;cell.append(tag);}
      if(hinted){const delta=directions[toWorld(hinted)];if(x===game.x+delta[0]&&y===game.y+delta[1]){cell.classList.add('hinted');const arrow=document.createElement('b');arrow.className='workshop-hint-arrow';arrow.textContent=directions[hinted][2];cell.append(arrow);}}
      if(x===game.x&&y===game.y)labels.push(t(26));
      cell.setAttribute('aria-label',labels.join(' · '));
    });
    const [col,row]=tilePosition(game.x,game.y);
    player.style.left=`${col*(portrait()?20:12.5)}%`; player.style.top=`${row*(portrait()?12.5:20)}%`;
  }
  $('workshop-undo').addEventListener('click',undoMove);
  $('workshop-hint').addEventListener('click',hint);
  $('workshop-reset').addEventListener('click',() => {if(canAct()){start(stage,true);feedback(t(32));}});
  $('start-game').addEventListener('click',() => {selectedStageIndex=Math.min(profiles.length-1,best);show('stage');});
  $('stage-back').addEventListener('click',() => show('main'));
  $('battle-back').addEventListener('click',() => {
    if(screen==='result'){show('stage');return;}
    leaving=true; $('workshop-leave-copy').textContent=`${common(9)} ${stage}. ${t(17)}`;
    dialog.showModal(); $('workshop-stay').focus(); observe();
  });
  function stay(){leaving=false;dialog.close();$('battle-back').focus({preventScroll:true});observe();}
  $('workshop-stay').addEventListener('click',stay);
  dialog.addEventListener('cancel',event=>{event.preventDefault();stay();});
  $('workshop-leave').addEventListener('click',()=>{measure.ended=true;measure.outcome='abandon';show('stage');});
  $('to-stages').addEventListener('click',()=>show('stage'));
  $('retry').addEventListener('click',()=>start(stage,true));
  $('next').addEventListener('click',()=>{if(resultWin&&stage<profiles.length)start(stage+1);});
  window.addEventListener('keydown',event => {
    if(!canAct()||event.ctrlKey||event.metaKey||event.altKey||event.repeat||event.target.matches('input,select,textarea'))return;
    const d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',a:'left',s:'down',d:'right'}[event.key]||{W:'up',A:'left',S:'down',D:'right'}[event.key];
    if(d){event.preventDefault();move(d);} else if(event.key==='z'||event.key==='Z'){event.preventDefault();undoMove();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){audio?.stop();settleEffects();grid.getAnimations({subtree:true}).forEach(a=>a.finish());}});
  window.addEventListener('pagehide',()=>audio?.stop());
  window.addEventListener('weightplay:market-locale-change',localize);
  window.addEventListener('resize',()=>{hinted=null;if(game)render();},{passive:true});
  ensureStageSelector();
  localize(); show('main');
})();
