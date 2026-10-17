/* Game-owned rules; shared frame, audio, analytics and reward services. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const locales=['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
  const locale=locales.includes(document.documentElement.lang)?document.documentElement.lang:'en';
  const copy={
    en:'Hangman|Start Game|Next word|Restart word|Reveal letter · −25|Hint used|Choose a letter or type on your keyboard. The theme is your first clue.|Good find|Not in this word|Already guessed · no cost|Chances left|Words solved|Word uncovered!|A clue for next time|Score|Moves|Best|Return to Main|letters|Puzzles|Nature|Space|Places|Food|Travel|Crack 60 English words across six themes. Reveal the word before six misses.|One hint reveals a letter, adds one move and costs 25 points. Repeated letters are free. Restart keeps the word. Solved words and best scores save in this browser.',
    'zh-Hant':'猜字吊人|開始遊戲|下一個單字|重猜這個字|揭開字母 · −25 分|已使用提示|先看主題，再選字母。也可以直接用鍵盤輸入。|猜對了|不在這個單字裡|猜過了，不扣次數|剩餘機會|已解單字|單字解開了！|記住這個字，下次再挑戰|得分|步數|最佳|返回主畫面|個字母|謎題|自然|太空|場所|食物|交通旅行|探索六種主題、60 個英文單字。在六次猜錯前揭開答案。|每局可提示一次，揭開一個字母，增加一步並扣 25 分。重複輸入不扣次數，重猜保留同一單字。已解單字與最佳成績儲存在這個瀏覽器。',
    'zh-Hans':'猜词吊人|开始游戏|下一个单词|重猜这个词|揭开字母 · −25 分|已使用提示|先看主题，再选字母。也可以直接用键盘输入。|猜对了|不在这个单词里|猜过了，不扣次数|剩余机会|已解单词|单词解开了！|记住这个词，下次再挑战|得分|步数|最佳|返回主画面|个字母|谜题|自然|太空|场所|食物|交通旅行|探索六种主题、60 个英文单词。在六次猜错前揭开答案。|每局可提示一次，揭开一个字母，增加一步并扣 25 分。重复输入不扣次数，重猜保留同一单词。已解单词与最佳成绩保存在此浏览器。',
    ja:'ハングマン|ゲーム開始|次の単語|同じ単語をやり直す|1文字表示 · −25点|ヒント使用済み|テーマを手掛かりに文字を選ぼう。キーボードも使えます。|正解|この単語にはありません|選択済み・消費なし|残りのチャンス|解いた単語|単語を解明！|次への手掛かりにしよう|スコア|手数|ベスト|メインに戻る|文字|パズル|自然|宇宙|場所|食べ物|旅と乗り物|6つのテーマ、60の英単語。6回間違える前に解こう。|ヒントは1回、1文字を開き1手と25点を消費します。重複入力は無料。やり直しても同じ単語です。解いた単語とベストはこのブラウザに保存。',
    ko:'행맨|게임 시작|다음 단어|현재 단어 다시 시작|글자 공개 · −25점|힌트 사용 완료|테마를 보고 글자를 고르세요. 키보드도 사용할 수 있어요.|정답|이 단어에는 없어요|이미 선택함 · 소모 없음|남은 기회|푼 단어|단어를 찾았어요!|다음 도전을 위한 새 단어|점수|횟수|최고|메인으로 돌아가기|글자|퍼즐|자연|우주|장소|음식|여행과 교통|여섯 테마의 영어 단어 60개. 여섯 번 틀리기 전에 풀어 보세요.|힌트는 한 번, 글자 하나를 열며 1회와 25점을 사용합니다. 중복 입력은 무료이며 다시 시작해도 같은 단어입니다. 푼 단어와 최고 점수는 이 브라우저에 저장됩니다.',
    es:'Ahorcado|Jugar|Siguiente palabra|Reiniciar palabra|Revelar letra · −25|Pista usada|Elige una letra usando el tema. También puedes usar el teclado.|Bien hecho|No está en la palabra|Ya elegida · sin coste|Intentos restantes|Palabras resueltas|¡Palabra descubierta!|Una pista para la próxima|Puntos|Jugadas|Récord|Volver al inicio|letras|Acertijos|Naturaleza|Espacio|Lugares|Comida|Viajes|Resuelve 60 palabras inglesas de seis temas antes de seis fallos.|Una pista revela una letra, suma una jugada y resta 25 puntos. Repetir es gratis. Reiniciar conserva la palabra. Los aciertos y el récord se guardan en este navegador.',
    'pt-BR':'Forca|Jogar|Próxima palavra|Reiniciar palavra|Revelar letra · −25|Dica usada|Escolha uma letra usando o tema. Você também pode usar o teclado.|Acertou|Não está na palavra|Já escolhida · sem custo|Chances restantes|Palavras resolvidas|Palavra descoberta!|Uma pista para a próxima|Pontos|Jogadas|Recorde|Voltar ao início|letras|Quebra-cabeças|Natureza|Espaço|Lugares|Comida|Viagens|Descubra 60 palavras inglesas em seis temas antes de seis erros.|Uma dica revela uma letra, soma uma jogada e desconta 25 pontos. Repetir é grátis. Reiniciar mantém a palavra. Soluções e recorde ficam neste navegador.',
    fr:'Pendu|Jouer|Mot suivant|Recommencer ce mot|Révéler une lettre · −25|Indice utilisé|Choisissez une lettre avec le thème. Le clavier fonctionne aussi.|Bien trouvé|Absent de ce mot|Déjà choisie · sans coût|Essais restants|Mots trouvés|Mot découvert !|Un indice pour la prochaine fois|Score|Coups|Record|Retour à l’accueil|lettres|Énigmes|Nature|Espace|Lieux|Aliments|Voyages|Trouvez 60 mots anglais dans six thèmes avant six erreurs.|Un indice révèle une lettre, ajoute un coup et coûte 25 points. Répéter est gratuit. Recommencer garde le mot. Mots trouvés et record sont sauvegardés ici.',
    de:'Galgenmännchen|Spiel starten|Nächstes Wort|Wort neu starten|Buchstabe aufdecken · −25|Hinweis genutzt|Wähle einen Buchstaben. Das Thema hilft. Auch per Tastatur.|Richtig|Nicht in diesem Wort|Bereits gewählt · kostenlos|Verbleibende Versuche|Gelöste Wörter|Wort entschlüsselt!|Ein Hinweis fürs nächste Mal|Punkte|Züge|Bestwert|Zum Hauptmenü|Buchstaben|Rätsel|Natur|Weltraum|Orte|Essen|Reisen|Löse 60 englische Wörter aus sechs Themen vor sechs Fehlern.|Ein Hinweis deckt einen Buchstaben auf, kostet einen Zug und 25 Punkte. Wiederholungen kosten nichts. Neustart behält das Wort. Lösungen und Bestwert werden hier gespeichert.',
    it:'Impiccato|Gioca|Parola successiva|Ricomincia parola|Rivela lettera · −25|Indizio usato|Scegli una lettera usando il tema. Puoi usare anche la tastiera.|Corretto|Non è nella parola|Già scelta · nessun costo|Tentativi rimasti|Parole risolte|Parola scoperta!|Un indizio per la prossima volta|Punti|Mosse|Record|Torna alla home|lettere|Enigmi|Natura|Spazio|Luoghi|Cibo|Viaggi|Scopri 60 parole inglesi in sei temi prima di sei errori.|Un indizio rivela una lettera, aggiunge una mossa e costa 25 punti. Ripetere è gratuito. Ricominciare conserva la parola. Soluzioni e record sono salvati qui.',
    ru:'Виселица|Начать игру|Следующее слово|Начать слово заново|Открыть букву · −25|Подсказка использована|Выберите букву по теме. Можно использовать клавиатуру.|Верно|Нет в этом слове|Уже выбрана · без штрафа|Осталось попыток|Разгадано слов|Слово разгадано!|Подсказка на будущее|Очки|Ходы|Рекорд|На главную|букв|Загадки|Природа|Космос|Места|Еда|Путешествия|Разгадайте 60 английских слов на шесть тем до шести ошибок.|Одна подсказка открывает букву, добавляет ход и стоит 25 очков. Повторы бесплатны. Перезапуск сохраняет слово. Решения и рекорд сохраняются в этом браузере.',
    hi:'हैंगमैन|खेल शुरू करें|अगला शब्द|शब्द फिर शुरू करें|अक्षर खोलें · −25|संकेत इस्तेमाल हुआ|विषय देखकर अक्षर चुनें। कीबोर्ड भी इस्तेमाल कर सकते हैं।|सही|इस शब्द में नहीं है|पहले चुना गया · कोई दंड नहीं|बचे अवसर|हल किए शब्द|शब्द मिल गया!|अगली बार के लिए संकेत|अंक|चालें|सर्वश्रेष्ठ|मुख्य स्क्रीन|अक्षर|पहेलियाँ|प्रकृति|अंतरिक्ष|स्थान|भोजन|यात्रा|छह गलतियों से पहले छह विषयों के 60 अंग्रेज़ी शब्द खोजें।|एक संकेत एक अक्षर खोलता है, एक चाल जोड़ता है और 25 अंक घटाता है। दोहराना मुफ़्त है। फिर शुरू करने पर वही शब्द रहता है। हल और रिकॉर्ड इसी ब्राउज़र में बचते हैं।',
    ar:'الرجل المشنوق|ابدأ اللعب|الكلمة التالية|أعد هذه الكلمة|اكشف حرفًا · −25|استُخدم التلميح|اختر حرفًا مستعينًا بالموضوع. يمكنك استخدام لوحة المفاتيح أيضًا.|إجابة صحيحة|ليس في هذه الكلمة|اختير سابقًا · بلا تكلفة|المحاولات المتبقية|الكلمات المحلولة|اكتُشفت الكلمة!|دليل جديد للمرة القادمة|النقاط|الحركات|الأفضل|العودة للرئيسية|حروف|ألغاز|الطبيعة|الفضاء|أماكن|طعام|السفر|اكتشف 60 كلمة إنجليزية في ستة مواضيع قبل ستة أخطاء.|تلميح واحد يكشف حرفًا ويضيف حركة ويخصم 25 نقطة. التكرار مجاني وإعادة البدء تحفظ الكلمة. تُحفظ الكلمات المحلولة وأفضل نتيجة في هذا المتصفح.'
  };
  const text=(copy[locale]||copy.en).split('|'), t=n=>text[n];
  const finishCopy={en:'Solve the word to win. Six misses reveal the answer and end the round. Next word continues; Return to Main leaves the round.','zh-Hant':'猜出單字就獲勝；猜錯六次會揭露答案並結束回合。「下一個單字」繼續挑戰，「返回主畫面」離開回合。','zh-Hans':'猜出单词就获胜；猜错六次会揭露答案并结束回合。“下一个单词”继续挑战，“返回主画面”离开回合。',ja:'単語を解けば勝利。6回間違えると答えを表示して終了します。「次の単語」で続け、「メインに戻る」で終了します。',ko:'단어를 풀면 승리합니다. 여섯 번 틀리면 답을 보여 주고 종료합니다. 다음 단어로 계속하거나 메인으로 돌아갈 수 있어요.',es:'Resuelve la palabra para ganar. Seis fallos revelan la respuesta y terminan la ronda. Siguiente palabra continúa; Volver al inicio sale de la ronda.','pt-BR':'Resolva a palavra para vencer. Seis erros revelam a resposta e encerram a rodada. Próxima palavra continua; Voltar ao início sai da rodada.',fr:'Trouvez le mot pour gagner. Six erreurs révèlent la réponse et terminent la manche. Mot suivant continue ; Retour à l’accueil quitte la manche.',de:'Löse das Wort, um zu gewinnen. Sechs Fehler zeigen die Antwort und beenden die Runde. Nächstes Wort setzt fort; Zum Hauptmenü verlässt die Runde.',it:'Risolvi la parola per vincere. Sei errori rivelano la risposta e terminano il turno. Parola successiva continua; Torna alla home esce dal turno.',ru:'Разгадайте слово, чтобы победить. Шесть ошибок открывают ответ и завершают раунд. Следующее слово продолжает игру; На главную выходит из раунда.',hi:'शब्द हल करने पर जीत मिलती है। छह गलतियों पर उत्तर दिखता है और राउंड समाप्त होता है। अगला शब्द खेल जारी रखता है; मुख्य स्क्रीन राउंड से बाहर ले जाती है।',ar:'حل الكلمة لتفوز. ستة أخطاء تكشف الإجابة وتنهي الجولة. الكلمة التالية تتابع اللعب، والعودة للرئيسية تغادر الجولة.'};
  const groups=[
    'PUZZLE RIDDLE SECRET PATTERN NUMBER MEMORY LOGIC ANSWER CLUE MYSTERY',
    'JUNGLE FOREST RIVER FLOWER MEADOW ISLAND GARDEN BAMBOO OCEAN SUNSET',
    'PLANET COMET METEOR GALAXY ORBIT SATURN NEBULA LUNAR SOLAR STAR',
    'CASTLE BRIDGE TOWER PALACE HARBOR MARKET MUSEUM SCHOOL TEMPLE LIBRARY',
    'ORANGE APPLE BANANA CHERRY CARROT COOKIE LEMON PEPPER WALNUT HONEY',
    'ROCKET TRAIN CANOE BICYCLE BALLOON GLIDER SAILBOAT TRAM TICKET VOYAGE'
  ].map(row=>row.split(' '));
  const themes=['puzzle','nature','space','places','food','travel'];
  const deck=Array.from({length:10},(_,n)=>groups.map((words,theme)=>({target:words[n],theme}))).flat();
  const valid=new Set(deck.map(word=>word.target));
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Storage is optional. */}};
  const raw=read('weightplay_hangman_progress_v1',{});
  const progress={cursor:Number.isSafeInteger(raw?.cursor)&&raw.cursor>=0?raw.cursor%60:0,solved:Array.isArray(raw?.solved)?[...new Set(raw.solved.filter(word=>valid.has(word)))]:[]};
  let best=Math.max(0,Number(read('weightplay_popular_hangman_best',0))||0),state=null,phase='main',roundKey=null;
  const root=$('popularArcade');
  Object.assign(document.body.dataset,{gameId:'hangman',wpGameId:'hangman',gameVersion:'v21',wpGameVersion:'v21',wpInterfaceVersion:'9',screen:'main'});
  root.dataset.wpFrameRoot='';root.dataset.runtimeLocalize='off';
  document.body.dataset.wpGameOwnedGuide='';
  document.documentElement.classList.add('has-game-page-info');document.body.classList.add('has-game-page-info');
  document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${t(0)} | WeightPlay`;
  $('gameTitle').textContent=t(0);$('objective').textContent=t(25);
  for(const [id,n] of [['startBtn',1],['retryBtn',2],['restartBtn',3],['hintBtn',4],['homeBtn',17]])$(id).textContent=t(n);
  const mainContent=root.querySelector('.main-panel');mainContent.prepend(root.querySelector('.preview-art'));
  root.querySelector('.preview-art img').src='/games/hangman/assets/hangman-cover-v21.webp';
  const mainBack=document.createElement('a');mainBack.className='main-return';mainBack.dataset.wpReturn='main';mainBack.href='/';mainBack.setAttribute('aria-label','WeightPlay');mainBack.innerHTML='<span aria-hidden="true">←</span><img src="/assets/weightplay-logo.png" alt="">';root.querySelector('.arcade-header').prepend(mainBack);
  const back=document.createElement('button');back.type='button';back.dataset.wpReturn='battle';back.className='battle-back';back.textContent='←';back.setAttribute('aria-label',t(17));root.querySelector('.battle-top').prepend(back);
  const names=['English','繁體中文','简体中文','日本語','한국어','Español','Português','Français','Deutsch','Italiano','Русский','हिन्दी','العربية'];
  $('localeSelect').replaceChildren(...locales.map((value,i)=>{const option=document.createElement('option');option.value=value;option.textContent=names[i];return option;}));$('localeSelect').value=locale;
  const progressNode=document.createElement('span');progressNode.id='hangmanProgress';progressNode.className='hangman-progress';$('objective').after(progressNode);
  const mainProgress=()=>{progressNode.textContent=`${t(11)} · ${progress.solved.length} / 60`;};mainProgress();
  const audio=window.WeightPlayAudio?.createScope(),sound=id=>audio?.play(id);
  window.WeightPlayAudio?.preload(['feedback.success','feedback.error','feedback.hint','game.start','result.win','result.lose']);
  const animate=node=>{if(!node||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;node.getAnimations().forEach(a=>a.cancel());node.animate([{opacity:.5},{opacity:1}],{duration:220,easing:'ease-out'});};
  const announce=(message,kind='ready')=>{$('gameMessage').textContent=message;$('gameMessage').dataset.feedback=kind;animate($('gameMessage'),kind==='wrong');};
  const measurement=()=>({screen:phase==='result'?null:phase,roundKey,started:!!state,ended:!!state?.done,outcome:state?.win?'win':'lose',paused:document.hidden||!!root.querySelector('.battle-panel')?.inert,node:$('battleScreen'),activityMode:'input',idleSeconds:300,keyboardKeys:[]});
  const notify=()=>{window.dispatchEvent(new Event('weightplay:shell-sync'));window.WonderAnalytics?.game?.observeState(measurement);};
  const show=next=>{phase=next;document.body.dataset.screen=next;$('mainScreen').hidden=next!=='main';$('battleScreen').hidden=next==='main';$('resultScreen').hidden=next!=='result';if(next==='main')mainProgress();notify();};
  const board=$('board');
  board.innerHTML='<div class="hangman-round"><span id="hangmanTheme" class="hangman-theme"></span><span id="hangmanLength" class="hangman-length"></span></div><div class="hangman-word" dir="ltr" role="group"></div><div class="hangman-life"><span id="hangmanLifeLabel"></span><strong id="hangmanLifeValue"></strong></div><div class="hangman-life-track" aria-hidden="true"></div>';
  const slots=board.querySelector('.hangman-word'),track=board.querySelector('.hangman-life-track');track.innerHTML='<span></span>'.repeat(6);
  $('controls').innerHTML=`<div class="letters" dir="ltr" role="group" aria-label="${t(18)}">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter=>`<button class="letter" type="button" data-value="${letter}" aria-pressed="false">${letter}</button>`).join('')}</div>`;
  const keys=[...$('controls').querySelectorAll('.letter')];
  const render=()=>{
    $('hangmanTheme').textContent=t(19+state.theme);$('hangmanLength').textContent=`${state.target.length} ${t(18)}`;slots.dataset.wordKey=themes[state.theme];
    [...slots.children].forEach((slot,i)=>{const revealed=state.guesses.has(state.target[i]);if(revealed&&!slot.classList.contains('revealed'))animate(slot);slot.classList.toggle('revealed',revealed);slot.textContent=revealed?state.target[i]:'_';});
    slots.setAttribute('aria-label',[...state.target].map(letter=>state.guesses.has(letter)?letter:'_').join(' '));
    $('hangmanLifeLabel').textContent=t(10);$('hangmanLifeValue').textContent=`${6-state.misses} / 6`;track.dataset.danger=String(state.misses>=4);[...track.children].forEach((node,i)=>node.classList.toggle('spent',i<state.misses));
    $('roundLabel').textContent=`${t(15)} ${state.moves} · ${progress.solved.length}/60`;
    keys.forEach(key=>{const used=state.guesses.has(key.dataset.value);key.setAttribute('aria-pressed',String(used));key.classList.toggle('used',used);key.dataset.outcome=used?(state.target.includes(key.dataset.value)?'correct':'wrong'):'';key.setAttribute('aria-label',used?`${key.dataset.value}: ${t(9)}`:key.dataset.value);});
    $('hintBtn').disabled=state.hintUsed;$('hintBtn').textContent=t(state.hintUsed?5:4);
  };
  const canPlay=()=>phase==='battle'&&!state.done&&!document.hidden&&!root.querySelector('.battle-panel').inert;
  const settle=win=>{
    if(state.done)return;state.done=true;state.win=win;
    const score=win?150+(6-state.misses)*20-(state.hintUsed?25:0):0;
    if(win){if(!progress.solved.includes(state.target))progress.solved.push(state.target);best=Math.max(best,score);write('weightplay_popular_hangman_best',best);}
    progress.cursor=(state.wordIndex+1)%60;write('weightplay_hangman_progress_v1',progress);
    $('resultScreen').dataset.outcome=win?'win':'loss';$('resultTitle').textContent=t(win?12:13);
    const answer=document.createElement('strong');answer.className='hangman-answer';answer.dir='ltr';answer.textContent=state.target;const context=document.createElement('span');context.textContent=`${t(19+state.theme)} · ${t(11)} ${progress.solved.length}/60`;$('resultCopy').replaceChildren(answer,context);
    $('resultStats').innerHTML=[[14,score],[15,state.moves],[16,best]].map(([n,value])=>`<span class="stat">${t(n)}<strong>${value}</strong></span>`).join('');
    show('result');animate($('resultScreen').firstElementChild);sound(win?'result.win':'result.lose');
    if(win)window.dispatchEvent(new CustomEvent('weightplay:game-completed',{detail:{gameId:'hangman',success:true,outcome:'win',completionId:'first-completion'}}));
  };
  const guess=(letter,hint=false)=>{
    if(!canPlay()||!/^[A-Z]$/.test(letter))return;
    if(state.guesses.has(letter)){announce(`${letter} · ${t(9)}`,'used');return;}
    $('gameMessage').classList.remove('first-steps');state.guesses.add(letter);state.moves++;if(hint)state.hintUsed=true;
    const correct=state.target.includes(letter);if(!correct)state.misses++;render();announce(`${letter} · ${t(hint?5:correct?7:8)}`,correct?'correct':'wrong');
    if([...state.target].every(value=>state.guesses.has(value)))settle(true);else if(state.misses===6)settle(false);else sound(hint?'feedback.hint':correct?'feedback.success':'feedback.error');
  };
  const start=restart=>{
    if(restart&&!canPlay())return;const wordIndex=restart?state.wordIndex:progress.cursor;
    state={...deck[wordIndex],wordIndex,guesses:new Set(),moves:0,misses:0,hintUsed:false,done:false};roundKey={};
    slots.replaceChildren(...[...state.target].map(()=>{const slot=document.createElement('span');slot.className='hangman-slot';return slot;}));
    render();show('battle');$('gameMessage').classList.add('first-steps');announce(t(6));animate(board);sound('game.start');keys[0].focus({preventScroll:true});
  };
  $('startBtn').addEventListener('click',()=>start(false));$('retryBtn').addEventListener('click',()=>start(false));$('restartBtn').addEventListener('click',()=>start(true));$('homeBtn').addEventListener('click',()=>show('main'));back.addEventListener('click',()=>show('main'));
  $('hintBtn').addEventListener('click',()=>{if(canPlay()&&!state.hintUsed)guess([...state.target].find(letter=>!state.guesses.has(letter)),true);});
  $('controls').addEventListener('click',event=>{const key=event.target.closest('.letter');if(key)guess(key.dataset.value);});
  document.addEventListener('keydown',event=>{if(!canPlay()||event.repeat||event.ctrlKey||event.altKey||event.metaKey||event.isComposing||event.target.closest('input,select,textarea,[contenteditable="true"]'))return;if(/^[a-z]$/i.test(event.key)){event.preventDefault();guess(event.key.toUpperCase());}});
  const stopEffects=()=>{audio?.stop();root.getAnimations({subtree:true}).forEach(a=>a.cancel());};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopEffects();});window.addEventListener('pagehide',stopEffects);window.addEventListener('weightplay:analytics-ready',notify);
  window.addEventListener('weightplay:shell-sync',()=>{if(document.body.dataset.screen==='main')stopEffects();});
  document.addEventListener('DOMContentLoaded',()=>{
    const guide=document.querySelector('[data-wp-game-guide]'),sections=guide?.querySelector('.game-info-sections');if(!sections)return;
    const labels={en:['Goal','How to play','Controls and rules','Finishing and feedback'],'zh-Hant':['目標','玩法','操作與規則','結束與回饋'],'zh-Hans':['目标','玩法','操作与规则','结束与反馈'],ja:['目標','遊び方','操作とルール','結果と次のプレイ'],ko:['목표','플레이 방법','조작과 규칙','결과와 다음 플레이'],es:['Objetivo','Cómo jugar','Controles y reglas','Resultados'], 'pt-BR':['Objetivo','Como jogar','Controles e regras','Resultados'],fr:['Objectif','Comment jouer','Commandes et règles','Résultats'],de:['Ziel','Spielablauf','Steuerung und Regeln','Ergebnis'],it:['Obiettivo','Come giocare','Comandi e regole','Risultati'],ru:['Цель','Как играть','Управление и правила','Результаты'],hi:['लक्ष्य','कैसे खेलें','नियंत्रण और नियम','परिणाम'],ar:['الهدف','طريقة اللعب','التحكم والقواعد','النتائج']};
    const related=sections.querySelector('.game-info-related-section');const paragraphs=[t(25),t(6),t(26),finishCopy[locale]];
    const authored=paragraphs.map((text,i)=>{const section=document.createElement('div');section.className='game-info-section';const heading=document.createElement('h3');heading.textContent=labels[locale][i];const paragraph=document.createElement('p');paragraph.textContent=text;section.append(heading,paragraph);return section;});sections.replaceChildren(...authored,...(related?[related]:[]));const intro=guide.querySelector('.game-info-title > p');if(intro)intro.textContent=t(25);const title=guide.querySelector('.game-info-title h2');if(title)title.textContent=t(0);
  });
  show('main');
})();
