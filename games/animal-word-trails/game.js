(() => {
  const packs = {
    en: [
      { name: 'Forest friends', words: ['LION', 'BEAR', 'FOX', 'FROG'], board: ['L','I','O','N','B','E','A','R','F','O','X','G','F','R','O','G'] },
      { name: 'Forest trail', words: ['TREE', 'LEAF', 'NEST', 'TRAIL'], board: ['B','E','T','S','E','R','L','E','E','A','I','N','F','L','R','T'] },
      { name: 'Forest pond', words: ['POND', 'REED', 'FISH', 'WATER'], board: ['E','E','D','L','R','F','T','W','D','S','I','A','H','N','O','P'] },
      { name: 'Safari grassland', words: ['GIRAFFE', 'ZEBRA', 'GRASS', 'HERD'], board: ['F','E','R','G','F','A','G','I','S','D','R','B','S','H','E','Z'] },
      { name: 'Safari lookout', words: ['LION', 'PAW', 'ROCK', 'SUN'], rule: 'Blocked tiles cannot join a word path.', blocked: [15], board: ['I','L','W','P','E','O','K','A','R','C','N','U','A','O','S','X'] },
      { name: 'Ocean shallows', words: ['WHALE', 'TURTLE', 'CORAL', 'WAVE'], board: ['C','R','W','V','O','T','A','E','R','T','L','A','S','U','W','H'] },
      { name: 'Ocean current', words: ['DOLPHIN', 'SHELL', 'TIDE', 'KELP'], board: ['L','E','H','A','L','S','K','E','P','O','D','N','D','H','I','T'] },
      { name: 'Arctic camp', words: ['PENGUIN', 'SNOW', 'ICE', 'SEAL'], board: ['W','E','A','I','S','O','C','L','N','G','N','P','U','I','N','E'] },
      { name: 'Mountain path', words: ['OWL', 'EAGLE', 'CAVE', 'WIND'], rule: 'Follow the leaf direction into the one-way tile.', oneWay: { index: 5, from: 1 }, board: ['C','A','E','W','O','V','I','D','W','E','G','N','L','L','A','E'] },
      { name: 'Habitat album', words: ['FOREST', 'SAFARI', 'OCEAN', 'ARCTIC'], board: ['N','E','R','O','S','A','F','S','T','R','E','A','C','I','C','O'] }
    ],
    'zh-Hant': [
      { name: '森林朋友', words: ['獅子', '熊', '狐狸', '青蛙'], board: ['獅','子','熊','狐','狸','青','蛙','樹','葉','熊','獅','子','青','蛙','狐','狸'] },
      { name: '森林小徑', words: ['樹葉', '鳥巢', '小徑', '森林'], board: ['樹','葉','鳥','巢','小','徑','森','林','樹','葉','鳥','巢','森','林','小','徑'] }
    ]
  };
  const copy = { en: { title:'Animal Word Trails', intro:'Follow animal clues and connect a word path.', start:'Start trail', guideTitle:'A calm reading puzzle', guideBody:'Find animal and habitat words. Your progress stays on this device.', chooseStage:'Choose a trail', playStage:'Begin trail', hint:'Hint', clear:'Clear', check:'Check word', complete:'Trail complete', next:'Next trail', trails:'Trail menu', skill:'Reading · Focus · Logic · Animal knowledge', found:'found', try:'Try another path.', great:'Great reading!' }, 'zh-Hant': { title:'動物字詞小徑', intro:'跟著動物線索，連出正確的字詞路徑。', start:'開始小徑', guideTitle:'輕鬆的閱讀拼字遊戲', guideBody:'找出動物與棲地字詞，進度會保存在這台裝置。', chooseStage:'選擇小徑', playStage:'開始挑戰', hint:'提示', clear:'清除', check:'確認字詞', complete:'小徑完成', next:'下一條小徑', trails:'小徑選單', skill:'閱讀 · 專注 · 邏輯 · 動物知識', found:'已找到', try:'換一條路徑試試看。', great:'閱讀真棒！' } };
  // Keep Traditional Chinese source ASCII-safe so editor or publish encoding cannot corrupt player copy.
  packs['zh-Hant'] = [
    { name: '\u68ee\u6797\u670b\u53cb', words: ['\u7345\u5b50', '\u718a', '\u72d0\u72f8', '\u9752\u86d9'], board: ['\u7345','\u5b50','\u718a','\u72d0','\u6a39','\u8449','\u9752','\u72f8','\u718a','\u7345','\u5b50','\u86d9','\u9752','\u86d9','\u72d0','\u72f8'] },
    { name: '\u68ee\u6797\u5c0f\u5f91', words: ['\u6a39\u8449', '\u9ce5\u5de2', '\u5c0f\u5f91', '\u68ee\u6797'], board: ['\u6a39','\u8449','\u9ce5','\u5de2','\u5c0f','\u5f91','\u68ee','\u6797','\u6a39','\u8449','\u9ce5','\u5de2','\u68ee','\u6797','\u5c0f','\u5f91'] },
    { name: '\u68ee\u6797\u6c60\u5858', words: ['\u6c60\u5858','\u8606\u8449','\u9b5a','\u6c34'], board: ['\u6a39','\u8449','\u96f2','\u98a8','\u6c34','\u9b5a','\u5858','\u8349','\u77f3','\u8449','\u6d77','\u6c60','\u9ce5','\u5de2','\u8606','\u68ee'] },
    { name: '\u8349\u539f\u4e4b\u65c5', words: ['\u9577\u9818\u9e7f','\u6591\u99ac','\u8349\u539f','\u7378\u7fa4'], board: ['\u592a','\u967d','\u91ce','\u98a8','\u9577','\u9e7f','\u8349','\u99ac','\u7378','\u9818','\u6591','\u539f','\u7fa4','\u96f2','\u77f3','\u6a39'] },
    { name: '\u8349\u539f\u77ad\u671b', words: ['\u7345\u5b50','\u638c\u5370','\u5ca9\u77f3','\u592a\u967d'], rule: '\u5c01\u9396\u683c\u4e0d\u80fd\u52a0\u5165\u5b57\u8a5e\u8def\u5f91\u3002', blocked: [15], board: ['\u8349','\u967d','\u6c99','\u5b50','\u96f2','\u592a','\u7345','\u5f71','\u98a8','\u638c','\u77f3','\u9ce5','\u6a39','\u5370','\u5ca9','X'] },
    { name: '\u6d77\u5cb8\u6dfa\u6c34', words: ['\u9be8\u9b5a','\u70cf\u9f9c','\u73ca\u745a','\u6d77\u6d6a'], board: ['\u6c99','\u6d77','\u9f9c','\u85fb','\u6d77','\u6d6a','\u70cf','\u77f3','\u73ca','\u6ce2','\u9b5a','\u6bdb','\u96f2','\u745a','\u8c9d','\u9be8'] },
    { name: '\u6d77\u6d0b\u6f6e\u6d41', words: ['\u6d77\u8c5a','\u8c9d\u6bbc','\u6f6e\u6c50','\u6d77\u85fb'], board: ['\u6ce2','\u6f6e','\u85fb','\u77f3','\u8c5a','\u6d77','\u6c50','\u8c9d','\u6d6a','\u73ca','\u6c34','\u6bbc','\u6c99','\u6d77','\u5cb8','\u96f2'] },
    { name: '\u6975\u5730\u71df\u5730', words: ['\u4f01\u9d5d','\u96ea\u82b1','\u51b0\u5ddd','\u6d77\u8c79'], board: ['\u96f2','\u8c79','\u6d77','\u6c34','\u96ea','\u5e33','\u9d5d','\u4f01','\u82b1','\u51b7','\u5ddd','\u51b0','\u77f3','\u98a8','\u8173','\u5370'] },
    { name: '\u5c71\u8def\u4e4b\u65c5', words: ['\u8c93\u982d\u9df9','\u8001\u9df9','\u5c71\u6d1e','\u5c71\u98a8'], rule: '\u8acb\u9806\u8457\u8449\u7247\u65b9\u5411\u9032\u5165\u55ae\u5411\u683c\u3002', oneWay: { index: 8, from: 4 }, board: ['\u96f2','\u98a8','\u5c71','\u6a39','\u5c71','\u77f3','\u8001','\u9ce5','\u6d1e','\u8c93','\u982d','\u9df9','\u5ca9','\u98db','\u9df9','\u68ee'] },
    { name: '\u68f2\u5730\u5716\u9451', words: ['\u68ee\u6797','\u8349\u539f','\u6d77\u6d0b','\u6975\u5730'], board: ['\u6d77','\u9ce5','\u96f2','\u6a39','\u77f3','\u6d0b','\u8349','\u6c34','\u5c71','\u98a8','\u6797','\u539f','\u52d5','\u68ee','\u5730','\u6975'] }
  ];
  copy['zh-Hant'] = { title:'\u52d5\u7269\u5b57\u8a5e\u5c0f\u5f91', intro:'\u8ddf\u8457\u52d5\u7269\u7dda\u7d22\uff0c\u9023\u51fa\u6b63\u78ba\u7684\u5b57\u8a5e\u8def\u5f91\u3002', start:'\u958b\u59cb\u5c0f\u5f91', guideTitle:'\u8f15\u9b06\u7684\u95b1\u8b80\u62fc\u5b57\u904a\u6232', guideBody:'\u627e\u51fa\u52d5\u7269\u8207\u68f2\u5730\u5b57\u8a5e\uff0c\u9032\u5ea6\u6703\u5132\u5b58\u5728\u9019\u53f0\u88dd\u7f6e\u3002', chooseStage:'\u9078\u64c7\u5c0f\u5f91', playStage:'\u958b\u59cb\u6311\u6230', hint:'\u63d0\u793a', clear:'\u6e05\u9664', check:'\u78ba\u8a8d\u5b57\u8a5e', complete:'\u5c0f\u5f91\u5b8c\u6210', next:'\u4e0b\u4e00\u689d\u5c0f\u5f91', trails:'\u5c0f\u5f91\u9078\u55ae', skill:'\u95b1\u8b80 \u00b7 \u5c08\u6ce8 \u00b7 \u908f\u8f2f \u00b7 \u52d5\u7269\u77e5\u8b58', found:'\u5df2\u627e\u5230', try:'\u63db\u4e00\u689d\u8def\u5f91\u8a66\u8a66\u770b\u3002', great:'\u95b1\u8b80\u771f\u68d2\uff01' };
  copy.en.start = 'Start Game';
  copy['zh-Hant'].start = '\u958b\u59cb\u904a\u6232';
  const app = document.getElementById('app'), locale = document.getElementById('locale'); let lang = localStorage.wordTrailsLocale || 'en', stage = 0, path = [], found = new Set(), hints = 0, dragStartLength = 0;
  const $ = id => document.getElementById(id); const t = key => copy[lang][key];
  function screen(name) { document.querySelectorAll('[data-screen]').forEach(x => x.classList.toggle('hidden', x.dataset.screen !== name)); document.body.classList.toggle('wp-mobile-game-mode', name === 'battle'); if (name === 'battle') document.documentElement.requestFullscreen?.().catch(()=>{}); }
  function translate(){ document.documentElement.lang=lang; document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=t(el.dataset.copy)); }
  function save(){ localStorage.wordTrailsLocale=lang; localStorage.wordTrailsBest = JSON.stringify(JSON.parse(localStorage.wordTrailsBest || '{}')); }
  function renderStages(){ const rail=$('stageRail'); rail.innerHTML=''; const best=JSON.parse(localStorage.wordTrailsBest||'{}'); packs[lang].forEach((item,i)=>{ const card=document.createElement('button'); card.className='stage-card'+(i===stage?' selected':'')+(i>0&&!best[lang+'-'+(i-1)]?' locked':''); card.disabled=i>0&&!best[lang+'-'+(i-1)]; card.innerHTML=`<strong>${i+1}. ${item.name}</strong><span>${item.words.length} ${lang==='en'?'words':'個字詞'}</span>`; card.onclick=()=>{stage=i;renderStages()};rail.append(card); }); $('stageProgress').textContent=`${stage+1} / ${packs[lang].length}`; }
  function neighbors(a,b){ return Math.abs(Math.floor(a/4)-Math.floor(b/4))<=1 && Math.abs(a%4-b%4)<=1; }
  function renderBattle(){ const data=packs[lang][stage]; path=[]; found=new Set(); hints=0; $('battleTitle').textContent=data.name; $('objective').textContent=lang==='en'?'Find the animal words':'找出動物字詞'; $('foundCount').textContent=`0/${data.words.length}`; $('starCount').textContent='★ 0'; $('targets').innerHTML=data.words.map(w=>`<span class="target" data-word="${w}">${w}</span>`).join(''); const board=$('board'); board.innerHTML=''; data.board.forEach((letter,i)=>{const b=document.createElement('button');b.className='tile';b.dataset.index=i;b.textContent=letter;b.addEventListener('click',()=>select(i));b.addEventListener('pointerenter',e=>{if(e.buttons)select(i)});board.append(b)}); board.onpointerdown=e=>{if(e.target.matches('.tile')){dragStartLength=path.length;board.setPointerCapture(e.pointerId);select(+e.target.dataset.index)}}; board.onpointerup=()=>{if(path.length-dragStartLength>1)submit()}; $('feedback').textContent=lang==='en'?'Connect adjacent tiles.':'連接相鄰的字詞格。'; screen('battle'); }
  function select(i){ const data=packs[lang][stage]; if(data.blocked?.includes(i)||path.includes(i)) return; if(path.length && !neighbors(path.at(-1),i)) return; if(data.oneWay?.index===i && path.length && path.at(-1)!==data.oneWay.from){ $('feedback').textContent=lang==='en'?'Follow the leaf direction.':'\u8acb\u9806\u8457\u8449\u7247\u65b9\u5411\u524d\u9032\u3002'; return; } path.push(i); document.querySelectorAll('.tile').forEach(x=>x.classList.toggle('selected',path.includes(+x.dataset.index))); }
  function clear(){ path=[];document.querySelectorAll('.tile').forEach(x=>x.classList.remove('selected'));$('feedback').textContent=''; }
  function submit(){ const data=packs[lang][stage], word=path.map(i=>data.board[i]).join(''); if(!data.words.includes(word)||found.has(word)){ $('feedback').textContent=t('try'); clear(); return; } found.add(word); document.querySelector(`[data-word="${word}"]`).classList.add('done'); path.forEach(i=>document.querySelector(`.tile[data-index="${i}"]`).classList.add('correct')); $('feedback').textContent=t('great'); $('foundCount').textContent=`${found.size}/${data.words.length}`; $('starCount').textContent=`★ ${Math.max(1,3-hints)}`; if(found.size===data.words.length) setTimeout(result,450); else setTimeout(clear,420); }
  function hint(){ const data=packs[lang][stage], word=data.words.find(w=>!found.has(w)); if(!word)return; hints++; const ix=data.board.findIndex(l=>l===word[0]); clear(); select(ix); $('feedback').textContent=`${t('hint')}: ${word[0]}`; }
  function result(){ const key=lang+'-'+stage, best=JSON.parse(localStorage.wordTrailsBest||'{}'), stars=Math.max(1,3-hints); best[key]=Math.max(best[key]||0,stars);localStorage.wordTrailsBest=JSON.stringify(best); $('resultSummary').textContent=`${found.size} ${t('found')} · ★ ${stars}`; screen('result'); }
  function renderStages(){ const rail=$('stageRail'); rail.innerHTML=''; const best=JSON.parse(localStorage.wordTrailsBest||'{}'); const album=JSON.parse(localStorage.wordTrailsAlbum||'{}'); const cards=Object.keys(album).filter(key=>key.startsWith(lang+'-')).length; packs[lang].forEach((item,i)=>{ const card=document.createElement('button'); const locked=i>0&&!best[lang+'-'+(i-1)]; card.className='stage-card'+(i===stage?' selected':'')+(locked?' locked':''); card.disabled=locked; card.innerHTML=`<strong>${i+1}. ${item.name}</strong><span>${item.words.length} ${lang==='en'?'words':'\u500b\u5b57\u8a5e'}</span>`; card.onclick=()=>{stage=i;renderStages()};rail.append(card); }); $('stageProgress').textContent=lang==='en'?`${stage+1}/${packs[lang].length} · Cards ${cards}`:`${stage+1}/${packs[lang].length} · \u7dda\u7d22\u5361 ${cards}`; }
  function renderBattle(){ const data=packs[lang][stage]; path=[]; found=new Set(); hints=0; $('battleTitle').textContent=data.name; $('objective').textContent=lang==='en'?'Find the animal words':'\u627e\u51fa\u52d5\u7269\u5b57\u8a5e'; $('foundCount').textContent=`0/${data.words.length}`; $('starCount').textContent='\u2605 0'; $('targets').innerHTML=data.words.map(w=>`<span class="target" data-word="${w}">${w}</span>`).join(''); const board=$('board'); board.innerHTML=''; data.board.forEach((letter,i)=>{const b=document.createElement('button');b.className='tile'+(data.blocked?.includes(i)?' blocked':'');b.disabled=Boolean(data.blocked?.includes(i));b.dataset.index=i;b.textContent=letter;b.addEventListener('click',()=>select(i));b.addEventListener('pointerenter',e=>{if(e.buttons)select(i)});board.append(b)}); board.onpointerdown=e=>{if(e.target.matches('.tile')){dragStartLength=path.length;board.setPointerCapture(e.pointerId);select(+e.target.dataset.index)}}; board.onpointerup=()=>{if(path.length-dragStartLength>1)submit()}; $('feedback').textContent=lang==='en'?'Connect adjacent tiles.':'\u9023\u63a5\u76f8\u9130\u7684\u5b57\u8a5e\u683c\u3002'; screen('battle'); }
  function submit(){ const data=packs[lang][stage], word=path.map(i=>data.board[i]).join(''); if(!data.words.includes(word)||found.has(word)){ $('feedback').textContent=t('try'); clear(); return; } found.add(word); document.querySelector(`[data-word="${word}"]`).classList.add('done'); path.forEach(i=>document.querySelector(`.tile[data-index="${i}"]`).classList.add('correct')); $('feedback').textContent=t('great'); $('foundCount').textContent=`${found.size}/${data.words.length}`; $('starCount').textContent=`\u2605 ${Math.max(1,3-hints)}`; if(found.size===data.words.length) setTimeout(result,450); else setTimeout(clear,420); }
  function result(){ const key=lang+'-'+stage, best=JSON.parse(localStorage.wordTrailsBest||'{}'), stars=Math.max(1,3-hints); best[key]=Math.max(best[key]||0,stars);localStorage.wordTrailsBest=JSON.stringify(best); $('resultSummary').textContent=`${found.size} ${t('found')} \u00b7 \u2605 ${stars}`; screen('result'); }
  const baseRenderBattle = renderBattle;
  renderBattle = function(){ baseRenderBattle(); const rule=packs[lang][stage].rule; if(rule)$('objective').textContent=rule; };
  renderStages = function(){
    const rail=$('stageRail'), best=JSON.parse(localStorage.wordTrailsBest||'{}'), album=JSON.parse(localStorage.wordTrailsAlbum||'{}');
    const cards=Object.keys(album).filter(key=>key.startsWith(lang+'-')).length;
    rail.innerHTML='';
    packs[lang].forEach((item,i)=>{
      const card=document.createElement('button'), locked=i>0&&!best[lang+'-'+(i-1)];
      card.className='stage-card'+(i===stage?' selected':'')+(locked?' locked':'');
      card.disabled=locked;
      card.dataset.stage=String(i);
      card.innerHTML='<strong>'+String(i+1)+'. '+item.name+'</strong><span>'+String(item.words.length)+' '+(lang==='en'?'words':'\u500b\u5b57\u8a5e')+'</span>';
      card.onclick=()=>{ if(rail.dataset.dragging==='true') return; stage=i; renderBattle(); };
      rail.append(card);
    });
    $('stageProgress').textContent=(stage+1)+'/'+packs[lang].length+' · '+(lang==='en'?'Cards ':'\u7dda\u7d22\u5361 ')+cards;
  };
  function reveal(word){ const panel=$('clueReveal'); $('clueTitle').textContent=lang==='en'?`Clue found: ${word}`:`\u627e\u5230\u52d5\u7269\u7dda\u7d22\uff1a${word}`; $('clearFx').style.backgroundPosition=`${(found.size-1)%4*33.333}% center`; panel.classList.remove('hidden'); setTimeout(()=>panel.classList.add('hidden'),850); }
  const originalSubmit = submit;
  submit = function(){ const before=found.size; originalSubmit(); if(found.size>before){ const word=[...found].at(-1); const album=JSON.parse(localStorage.wordTrailsAlbum||'{}'); album[lang+'-'+word]=true; localStorage.wordTrailsAlbum=JSON.stringify(album); reveal(word); } };
  Object.assign(copy.en, {
    language:'Language', album:'Album', albumTitle:'Animal clues',
    backLobby:'Back to WeightPlay', backMain:'Back to main', backStage:'Back to trails', closeAlbum:'Close album', stages:'Trails', board:'Word board',
    seoTitle:'Animal Word Trails - WeightPlay', seoDescription:'Connect animal and habitat words in a calm reading puzzle.'
  });
  Object.assign(copy['zh-Hant'], {
    language:'\u8a9e\u8a00', album:'\u7dda\u7d22\u5361', albumTitle:'\u52d5\u7269\u7dda\u7d22\u5361',
    backLobby:'\u8fd4\u56de WeightPlay \u5927\u5ef3', backMain:'\u8fd4\u56de\u9996\u9801', backStage:'\u8fd4\u56de\u5c0f\u5f91\u9078\u55ae', closeAlbum:'\u95dc\u9589\u7dda\u7d22\u5361',
    stages:'\u5c0f\u5f91\u9078\u55ae', board:'\u5b57\u8a5e\u68cb\u76e4', seoTitle:'\u52d5\u7269\u5b57\u8a5e\u5c0f\u5f91 - WeightPlay',
    seoDescription:'\u9023\u7dda\u627e\u51fa\u52d5\u7269\u8207\u68f2\u5730\u5b57\u8a5e\u7684\u8f15\u9b06\u95b1\u8b80\u904a\u6232\u3002'
  });
  translate = function(){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=t(el.dataset.copy));
    document.querySelectorAll('[data-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.aria)));
    document.title=t('seoTitle');
    $('pageDescription').setAttribute('content',t('seoDescription'));
  };
  const rail=$('stageRail');
  let railStartX=0;
  let railStartScroll=0;
  let railPointerActive=false;
  let railStartStage=null;
  rail.addEventListener('pointerdown',event=>{
    railStartX=event.clientX;
    railStartScroll=rail.scrollLeft;
    railPointerActive=true;
    railStartStage=event.target.closest('.stage-card:not([disabled])')?.dataset.stage ?? null;
    rail.dataset.dragging='false';
    rail.setPointerCapture?.(event.pointerId);
  });
  rail.addEventListener('pointermove',event=>{
    if(!railPointerActive) return;
    const delta=event.clientX-railStartX;
    if(Math.abs(delta)<=10) return;
    rail.dataset.dragging='true';
    rail.scrollLeft=railStartScroll-delta;
  });
  rail.addEventListener('pointerup',event=>{
    const tappedStage=railStartStage;
    const dragged=rail.dataset.dragging==='true';
    railPointerActive=false;
    railStartStage=null;
    rail.releasePointerCapture?.(event.pointerId);
    const cards=[...rail.querySelectorAll('.stage-card')];
    const center=rail.scrollLeft+rail.clientWidth/2;
    const nearest=cards.reduce((best,card)=>Math.abs(card.offsetLeft+card.offsetWidth/2-center)<Math.abs(best.offsetLeft+best.offsetWidth/2-center)?card:best,cards[0]);
    nearest?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    if(tappedStage!==null && !dragged) {
      setTimeout(()=>{stage=Number(tappedStage);renderBattle();},0);
    }
    setTimeout(()=>{rail.dataset.dragging='false';},0);
  });
  rail.addEventListener('click',event=>{
    const card=event.target.closest('.stage-card:not([disabled])');
    if(!card || rail.dataset.dragging==='true') return;
    stage=Number(card.dataset.stage);
    renderBattle();
  });
  locale.value=lang; translate();
  locale.onchange=()=>{lang=locale.value;stage=0;save();translate();}; $('start').onclick=()=>{renderStages();screen('stage')}; $('stageBack').onclick=()=>screen('main'); $('playStage').onclick=renderBattle; $('battleBack').onclick=()=>{document.exitFullscreen?.();renderStages();screen('stage')}; $('clear').onclick=clear; $('hint').onclick=hint; $('submit').onclick=submit; $('next').onclick=()=>{stage=Math.min(stage+1,packs[lang].length-1);renderBattle()}; $('resultsBack').onclick=()=>{renderStages();screen('stage')}; $('album').onclick=()=>{const album=JSON.parse(localStorage.wordTrailsAlbum||'{}');const words=[...new Set(packs[lang].flatMap(x=>x.words))];$('albumList').innerHTML=words.map((word,index)=>{const x=(index%4)*33.333,y=Math.floor(index/4)*50;return `<span class="${album[lang+'-'+word]?'card':'locked'}" style="background-position:${x}% ${y}%">${album[lang+'-'+word]?word:'?'}</span>`}).join('');$('albumDialog').showModal()};$('closeAlbum').onclick=()=>$('albumDialog').close();
})();
