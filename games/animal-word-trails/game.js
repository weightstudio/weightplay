(() => {
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(battleTasksPaused || leaveConfirmOpen), node: document.body, stageId: stage + 1,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

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
  const copy = { en: { title:'Animal Word Trails', intro:'Follow animal clues and connect a word path.', start:'Start trail', guideTitle:'A calm reading puzzle', guideBody:'Find animal and habitat words. Your progress stays on this device.', chooseStage:'Choose a trail', playStage:'Begin trail', hint:'Hint', clear:'Clear', check:'Check word', complete:'Trail complete', next:'Next trail', trails:'Trail menu', replay:'Replay', skill:'Reading · Focus · Logic · Animal knowledge', found:'found', try:'Try another path.', great:'Great reading!' }, 'zh-Hant': { title:'動物字詞小徑', intro:'跟著動物線索，連出正確的字詞路徑。', start:'開始小徑', guideTitle:'輕鬆的閱讀拼字遊戲', guideBody:'找出動物與棲地字詞，進度會保存在這台裝置。', chooseStage:'選擇小徑', playStage:'開始挑戰', hint:'提示', clear:'清除', check:'確認字詞', complete:'小徑完成', next:'下一條小徑', trails:'小徑選單', replay:'再玩一次', skill:'閱讀 · 專注 · 邏輯 · 動物知識', found:'已找到', try:'換一條路徑試試看。', great:'閱讀真棒！' } };
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
  copy.hi = { title: '\u0936\u092c\u094d\u0926 \u091f\u094d\u0930\u0947\u0932\u094d\u0938', language: '\u092d\u093e\u0937\u093e', album: '\u090f\u0932\u094d\u092c\u092e', chooseStage: '\u0930\u093e\u0938\u094d\u0924\u093e \u091a\u0941\u0928\u0947\u0902', hint: '\u0938\u0902\u0915\u0947\u0924', undo: '\u092a\u093f\u091b\u0932\u0940 \u091a\u093e\u0932 \u0935\u093e\u092a\u0938 \u0932\u0947\u0902', clear: '\u0930\u093e\u0938\u094d\u0924\u093e \u092e\u093f\u091f\u093e\u090f\u0901', complete: '\u0930\u093e\u0938\u094d\u0924\u093e \u092a\u0942\u0930\u093e \u0939\u0941\u0906', next: '\u0905\u0917\u0932\u093e \u0930\u093e\u0938\u094d\u0924\u093e', replay: '\u092b\u093f\u0930 \u0938\u0947 \u0916\u0947\u0932\u0947\u0902', found: '\u0936\u092c\u094d\u0926 \u092e\u093f\u0932\u0947', backLobby: 'WeightPlay \u092a\u0930 \u0935\u093e\u092a\u0938 \u091c\u093e\u090f\u0901', backMain: '\u092e\u0941\u0916\u094d\u092f \u0938\u094d\u0915\u094d\u0930\u0940\u0928 \u092a\u0930 \u0935\u093e\u092a\u0938 \u091c\u093e\u090f\u0901', stages: '\u0930\u093e\u0938\u094d\u0924\u0947', words: '\u0936\u092c\u094d\u0926', leaveTitle: '\u0915\u094d\u092f\u093e \u0906\u092a \u092f\u0939 \u0930\u093e\u0938\u094d\u0924\u093e \u091b\u094b\u0921\u093c\u0928\u093e \u091a\u093e\u0939\u0924\u0947 \u0939\u0948\u0902?', keepReading: '\u092a\u0922\u093c\u0928\u093e \u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902', leaveTrail: '\u0930\u093e\u0938\u094d\u0924\u093e \u091b\u094b\u0921\u093c\u0947\u0902' };
  copy.ar = { title: '\u0645\u0633\u0627\u0631\u0627\u062a \u0643\u0644\u0645\u0629 \u0627\u0644\u062d\u064a\u0648\u0627\u0646', language: '\u0627\u0644\u0644\u063a\u0629', album: '\u0627\u0644\u0623\u0644\u0628\u0648\u0645', chooseStage: '\u0627\u062e\u062a\u0631 \u0645\u0633\u0627\u0631\u064b\u0627', hint: '\u062a\u0644\u0645\u064a\u062d', undo: '\u062a\u0631\u0627\u062c\u0639 \u0639\u0646 \u0627\u0644\u062e\u0637\u0648\u0629', clear: '\u0627\u0645\u0633\u062d \u0627\u0644\u0645\u0633\u0627\u0631', complete: '\u0627\u0643\u062a\u0645\u0644 \u0627\u0644\u0645\u0633\u0627\u0631', next: '\u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062a\u0627\u0644\u064a', replay: '\u0627\u0644\u0639\u0628 \u0645\u062c\u062f\u062f\u064b\u0627', found: '\u0643\u0644\u0645\u0627\u062a \u0639\u064f\u062b\u0631 \u0639\u0644\u064a\u0647\u0627', backLobby: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 WeightPlay', backMain: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629', stages: '\u0627\u0644\u0645\u0633\u0627\u0631\u0627\u062a', words: '\u0643\u0644\u0645\u0627\u062a', leaveTitle: '\u0647\u0644 \u062a\u0631\u064a\u062f \u0645\u063a\u0627\u062f\u0631\u0629 \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u0627\u0631\u061f', keepReading: '\u062a\u0627\u0628\u0639 \u0627\u0644\u0644\u0639\u0628', leaveTrail: '\u063a\u0627\u062f\u0631 \u0627\u0644\u0645\u0633\u0627\u0631' };
  const app = document.getElementById('app'), locale = document.getElementById('locale');
  const stageCanvas=document.querySelector('.stage-screen');stageCanvas?.setAttribute('data-wp-stage-landscape-width','760');stageCanvas?.setAttribute('data-wp-stage-landscape-height','360');
  const supportedLocales=['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
  const runtimeTranslate=value=>window.WeightPlayGameRuntimeLocalizer?.translate?.(String(value))||String(value);
  const cleanWord=value=>Array.from(String(value).normalize('NFC').toLocaleUpperCase()).filter(char=>/[\p{Letter}\p{Mark}]/u.test(char)).join('');
  // The original album stored the runtime translation after cleanWord. Keep
  // that exact transform for migration; new boards keep natural display text.
  function legacyTokens(localeName,value){
    return [...new Intl.Segmenter(localeName,{granularity:'grapheme'}).segment(value.normalize('NFC'))]
      .map(part=>part.segment).filter(part=>!/^\s+$/u.test(part));
  }
  function fallbackLocalizedStage(source,index){
    const words=source.words.map(word=>cleanWord(runtimeTranslate(word))).filter(Boolean);
    const needed=words.reduce((sum,word)=>sum+Array.from(word).length,0)+words.length-1;
    const size=Math.max(6,Math.ceil(Math.sqrt(needed))),snake=[];
    for(let row=0;row<size;row++)for(let step=0;step<size;step++)snake.push(row*size+(row%2?size-1-step:step));
    const board=Array(size*size).fill(''),paths=[];let cursor=0;
    words.forEach(word=>{const path=[];Array.from(word).forEach(char=>{const cell=snake[cursor++];board[cell]=char;path.push(cell);});paths.push(path);cursor++;});
    const fillers=Array.from(words.join(''));
    board.forEach((char,cell)=>{if(!char)board[cell]=fillers[(cell*7+index)%fillers.length]||'A';});
    const localized={name:runtimeTranslate(source.name),words,board,size};
    if(source.rule)localized.rule=runtimeTranslate(source.rule);
    if(source.blocked){const used=new Set(paths.flat()),blocked=[...board.keys()].reverse().find(cell=>!used.has(cell));if(blocked!==undefined)localized.blocked=[blocked];}
    if(source.oneWay&&paths[0]?.length>1)localized.oneWay={index:paths[0][1],from:paths[0][0]};
    return localized;
  }
  function buildLocalizedStage(source,index,localeName=lang){
    // A missing optional extension must leave the previous ten-trail game usable.
    if(!window.WordTrailsStage60)return fallbackLocalizedStage(source,index);
    const lexicon=window.WordTrailsStage60?.lexicon?.[localeName];
    if(!lexicon)throw new Error(`LEGACY_LEXICON_MISSING:${localeName}`);
    const targets=source.words.map(id=>{
      const display=lexicon[id];
      if(typeof display!=='string'||!display.trim())throw new Error(`LEGACY_WORD_MISSING:${localeName}:${id}`);
      const normalized=display.normalize('NFC'),tokens=legacyTokens(localeName,normalized);
      if(!tokens.length)throw new Error(`LEGACY_WORD_EMPTY:${localeName}:${id}`);
      return {id,display:normalized,tokens};
    });
    if(new Set(targets.map(item=>JSON.stringify(item.tokens))).size!==targets.length)
      throw new Error(`LEGACY_WORD_COLLISION:${localeName}:${index+1}`);
    const needed=targets.reduce((sum,item)=>sum+item.tokens.length,0)+targets.length-1;
    const size=Math.max(6,Math.ceil(Math.sqrt(needed)));
    if(size>6)throw new Error(`LEGACY_BOARD_TOO_LARGE:${localeName}:${index+1}:${size}`);
    const snake=[];
    for(let row=0;row<size;row++)for(let step=0;step<size;step++)snake.push(row*size+(row%2?size-1-step:step));
    const board=Array(size*size).fill('');
    let cursor=0;
    targets.forEach(item=>{item.path=[];item.tokens.forEach(token=>{const cell=snake[cursor++];board[cell]=token;item.path.push(cell)});cursor++});
    const fillers=targets.flatMap(item=>item.tokens);
    board.forEach((char,cell)=>{if(!char)board[cell]=fillers[(cell*7+index)%fillers.length]||'A'});
    const localized={name:runtimeTranslate(source.name),words:targets.map(item=>item.display),board,size,legacyLocalized:true,legacyTargets:targets};
    if(source.rule)localized.rule=runtimeTranslate(source.rule);
    if(source.blocked){const used=new Set(targets.flatMap(item=>item.path)),blocked=[...board.keys()].reverse().find(cell=>!used.has(cell));if(blocked===undefined)throw new Error(`LEGACY_BLOCKED_CELL_MISSING:${localeName}:${index+1}`);localized.blocked=[blocked]}
    if(source.oneWay){if(targets[0].path.length<2)throw new Error(`LEGACY_ONEWAY_PATH_SHORT:${localeName}:${index+1}`);localized.oneWay={index:targets[0].path[1],from:targets[0].path[0]};}
    return localized;
  }
  // Current-catalog aliases cannot prove older or mixed-locale translations;
  // retain every old key and skip aliases that are ambiguous today.
  function legacyAlbumAliases(sourceStages,translate){
    const aliases=new Map();
    for(const id of new Set(sourceStages.flatMap(source=>source.words))){
      const old=cleanWord(translate(id));
      if(!old)continue;
      const candidates=aliases.get(old)||new Set();candidates.add(id);aliases.set(old,candidates);
    }
    return aliases;
  }
  function migratedLegacyAlbum(album,localeName,sourceStages,lexicon,translate){
    const aliases=legacyAlbumAliases(sourceStages,translate);
    const displays=new Map();
    for(const [id,value] of Object.entries(lexicon)){
      if(typeof value!=='string'||!value.trim())continue;
      const display=value.normalize('NFC'),ids=displays.get(display)||new Set();ids.add(id);displays.set(display,ids);
    }
    let changed=false;const migrated={...album};
    for(const [old,ids] of aliases){
      if(ids.size!==1||album[`${localeName}-${old}`]!==true)continue;
      const id=[...ids][0],display=lexicon[id];
      if(typeof display!=='string'||!display.trim()||[...(displays.get(old)||[])].some(other=>other!==id))continue;
      const key=`${localeName}-${display.normalize('NFC')}`;
      if(migrated[key]!==true){migrated[key]=true;changed=true;}
    }
    return {album:migrated,changed};
  }
  function legacyWordForPath(data,selected){
    return data.legacyTargets.find(item=>item.tokens.length===selected.length
      &&item.tokens.every((token,index)=>data.board[selected[index]]===token))?.display;
  }
  function albumGroups(localeName,stages,album,lexicon,aliases){
    const displayIds=new Map();
    function identify(display,id){
      if(!display||!id)return;
      const ids=displayIds.get(display)||new Set();ids.add(id);displayIds.set(display,ids);
    }
    for(const [id,display] of Object.entries(lexicon||{}))if(typeof display==='string')identify(display.normalize('NFC'),id);
    for(const stageData of stages){
      for(const item of stageData.legacyTargets||stageData.targets||[])identify(item.display,item.id);
      if(localeName==='en'&&!stageData.word60&&!stageData.legacyLocalized)
        for(const word of stageData.words)if(lexicon?.[word])identify(word,word);
    }
    const groups=new Map();
    for(const stageData of stages)for(const word of stageData.words){
      const ids=displayIds.get(word),id=ids?.size===1?[...ids][0]:null,key=id?'id:'+id:'word:'+word;
      if(!groups.has(key))groups.set(key,{id,display:word,words:new Set(),unlocked:false});
      groups.get(key).words.add(word);
    }
    const prefix=localeName+'-';
    for(const [key,value] of Object.entries(album)){
      if(!key.startsWith(prefix)||!value)continue;
      const word=key.slice(prefix.length),oldIds=aliases?.get(word),knownIds=displayIds.get(word);
      const candidates=new Set([...(oldIds||[]),...(knownIds||[])]);
      let group=candidates.size===1?groups.get('id:'+ [...candidates][0]):null;
      // An ambiguous old word can unlock its exact neutral text card without
      // guessing which of several concepts it represented.
      if(!group)group=groups.get('word:'+word);
      if(!group){const historical='historical:'+word;if(!groups.has(historical))groups.set(historical,{id:null,display:word,words:new Set([word]),unlocked:false});group=groups.get(historical);}
      group.unlocked=true;
    }
    return [...groups.values()];
  }
  const storageFallback=new Map();
  function readStorage(key){try{const value=localStorage.getItem(key);if(value!==null)storageFallback.set(key,value);return value??storageFallback.get(key)??null;}catch{return storageFallback.get(key)??null;}}
  function writeStorage(key,value){const normalized=String(value);storageFallback.set(key,normalized);try{localStorage.setItem(key,normalized);}catch{}}
  function readRecord(key){try{return JSON.parse(readStorage(key)||'{}');}catch{return{};}}
  function migrateLegacyAlbum(localeName){
    const translator=window.WeightPlayGameRuntimeLocalizer,lexicon=window.WordTrailsStage60?.lexicon?.[localeName];
    if(!lexicon||translator?.locale!==localeName||typeof translator.translate!=='function')return;
    const original=readRecord('wordTrailsAlbum');
    const result=migratedLegacyAlbum(original,localeName,packs.en.slice(0,10),lexicon,word=>translator.translate(word));
    if(result.changed)writeStorage('wordTrailsAlbum',JSON.stringify(result.album));
  }
  const gameLocalePreference=readStorage('wordTrailsLocale');
  const platformLocale=readStorage('weightPlayLocale')||readStorage('weightplayLocale');
  const routedLocale=window.WonderI18n?.localeFromPath?.()||'';
  let lang = supportedLocales.includes(routedLocale)?routedLocale:(supportedLocales.includes(gameLocalePreference)?gameLocalePreference:(supportedLocales.includes(platformLocale)?platformLocale:'en')), stage = 0, path = [], found = new Set(), hints = 0, runStars = 0, dragStartLength = 0, boardPointerId = null, leaveConfirmOpen = false, leaveConfirmTrigger = null, resultActionClaimed = false;
  if(!packs[lang]){packs[lang]=packs.en.slice(0,10).map((source,index)=>buildLocalizedStage(source,index,lang));migrateLegacyAlbum(lang);}
  function currentAlbumGroups(album){
    const translator=window.WeightPlayGameRuntimeLocalizer;
    const aliases=translator?.locale===lang&&typeof translator.translate==='function'
      ?legacyAlbumAliases(packs.en.slice(0,10),word=>translator.translate(word)):null;
    return albumGroups(lang,packs[lang],album,window.WordTrailsStage60?.lexicon?.[lang],aliases);
  }
  // The extension is atomic: a partial or unverified campaign must never
  // replace the original ten stages. Verified boards are supplied separately.
  let stage60Packs=null;
  function installStage60() {
    const data=window.WordTrailsStage60, rules=window.WordTrailsStage60Rules, texts=window.WordTrailsStage60Copy;
    const unavailable=reason=>{window.__wordTrailsStage60Status=Object.freeze({ready:false,reason});};
    if(!data?.verifiedBoards||typeof data.buildStage!=='function'||!rules||!texts){unavailable('BOARD_MANIFEST_NOT_READY');return;}
    try {
      const next={};
      for(const localeName of supportedLocales){
        const localized=texts[localeName];
        if(!localized||localized.stageNames?.length!==50||!localized.stageNames.every(value=>typeof value==='string'&&value.trim())||!['bridge','moveBridge','bridgeChosen','bridgeBlocked','wildLeaf','selectTarget','lockedCategory','animalCategory','natureCategory','chooseCategory','wrongDirection','oneWildPerPath'].every(key=>typeof localized[key]==='string'&&localized[key].trim())||!['allowedCategory','chooseTarget','moveBridge','append','submit'].every(key=>typeof rules[key]==='function'))throw Error(`MISSING_RULES_OR_COPY:${localeName}`);
        const additions=[];
        for(let number=11;number<=60;number++){
          if(!data.verifiedBoards[localeName]?.[number])throw Error(`MISSING_VERIFIED_BOARD:${localeName}:${number}`);
          const board=data.buildStage(localeName,number);
          if(board?.id!==number||!Number.isInteger(board.size)||board.size<1||board.size>6||board.board?.length!==board.size**2||board.targets?.length!==4||new Set(board.targets.map(item=>item.id)).size!==4||new Set(board.targets.map(item=>item.display)).size!==4)throw Error(`INVALID_BOARD:${localeName}:${number}`);
          for(const item of board.targets){
            if(typeof item.display!=='string'||!item.display||!Array.isArray(item.tokens)||!Array.isArray(item.path)||item.path.length!==item.tokens.length)throw Error(`INVALID_TARGET:${localeName}:${number}:${item.id}`);
            const earlier=board.categoryOrder==='A→N'&&item.category==='nature'?'animal':board.categoryOrder==='N→A'&&item.category==='animal'?'nature':null;
            const checked={found:new Set(board.targets.filter(x=>x.category===earlier).map(x=>x.id)),committedCategory:board.categoryOrder==='Choice'?item.category:null,target:board.categoryOrder?item.id:null,bridge:item.bridge??null,path:[]};
            for(const cell of item.path){const step=rules.append(board,checked,cell);if(!step.ok)throw Error(`INVALID_PATH:${localeName}:${number}:${item.id}:${step.reason}`);checked.path=step.path;}
            if(!rules.submit(board,checked).ok)throw Error(`INVALID_SOLUTION:${localeName}:${number}:${item.id}`);
          }
          if(number>=31&&(board.targets.filter(x=>x.category==='animal').length!==2||board.targets.filter(x=>x.category==='nature').length!==2||!['A→N','N→A','Choice'].includes(board.categoryOrder)))throw Error(`INVALID_CATEGORIES:${localeName}:${number}`);
          additions.push({...board,name:localized.stageNames[number-11],words:board.targets.map(item=>item.display),word60:true});
        }
        next[localeName]=additions;
      }
      stage60Packs=next;
      packs[lang]=packs[lang].slice(0,10).concat(next[lang]);
      window.__wordTrailsStage60Status=Object.freeze({ready:true,reason:null});
    } catch(error) {
      unavailable(error?.message || 'BOARD_VALIDATION_FAILED');
      console.warn('WORD_TRAILS_STAGE60_DISABLED',error);
    }
  }
  const $ = id => document.getElementById(id);
  // These word and tile values already belong to the selected language.
  // Re-translating individual graphemes can make the visible board disagree
  // with the path data, especially across Traditional/Simplified Chinese.
  $('board').setAttribute('data-runtime-localize','off');
  $('targets').setAttribute('data-runtime-localize','off');
  const t = (key, values = {}) => {
    const owned=window.WordTrailsStage60Copy?.[lang]?.ui?.[key];
    const primary=(lang==='en'||lang==='zh-Hant')?(copy[lang]?.[key] ?? owned):(owned ?? copy[lang]?.[key]);
    return String(primary ?? runtimeTranslate(copy.en[key] ?? key))
      .replace(/\{(\w+)\}/gu, (_whole, name) => values[name] ?? '');
  };
  const track = (event, details = {}) => window.WonderAnalytics?.track(event, { game_id: 'animal-word-trails', locale: lang, stage: stage + 1, ...details });
  let screenFrame = null, stageUI = null, stageStats = null, battleStats = null;
  function makeStat() {
    const stat = document.createElement('div');
    const label = document.createElement('span');
    const value = document.createElement('strong');
    stat.append(label, value);
    return { stat, label, value };
  }
  function stagePoster(index) {
    if (index <= 2) return '/assets/animal-word-trails-forest-bg.webp';
    if (index <= 4) return '/assets/animal-word-trails-safari-bg.webp';
    if (index === 9) return '/assets/animal-word-trails-clue-cards.webp';
    return '/assets/interface7-redrawn/animal-word-trails.webp';
  }
  function stageConfig() {
    return {
      gameId: 'animal-word-trails', count: packs[lang].length,
      poster: '/assets/animal-word-trails-cover.webp',
      background: '/assets/lobby-block-atmosphere.svg',
      stage(index) {
        const item = packs[lang][index];
        const best = readRecord('wordTrailsBest');
        const locked = index > 0 && !best[lang + '-' + (index - 1)];
        const cleared = Boolean(best[lang + '-' + index]);
        return {
          id: index + 1, kicker: t('trailNumber', { n: index + 1 }),
          title: item.name, subtitle: `${item.words.length} ${t('words')}`,
          status: locked ? t('locked') : cleared ? t('completed') : t('available'),
          summary: item.rule || t('stageSummary', { n: item.words.length }),
          details: [item.words.join(' · '), item.rule || ''],
          poster: stagePoster(index), locked, cleared,
        };
      },
    };
  }
  function updateFrameStats() {
    const best = readRecord('wordTrailsBest');
    const album = readRecord('wordTrailsAlbum');
    const completed = Object.keys(best).filter(key => key.startsWith(lang + '-')).length;
    const clues = currentAlbumGroups(album).filter(item=>item.unlocked).length;
    if (stageStats) {
      stageStats.completed.label.textContent = t('progress');
      stageStats.completed.value.textContent = `${completed}/${packs[lang].length}`;
      stageStats.clues.label.textContent = t('cards');
      stageStats.clues.value.textContent = String(clues);
    }
    if (battleStats) {
      battleStats.trail.label.textContent = t('trail');
      battleStats.trail.value.textContent = `${stage + 1}/${packs[lang].length}`;
      battleStats.words.label.textContent = t('found');
      battleStats.words.value.textContent = `${found.size}/${packs[lang][stage].words.length}`;
      battleStats.stars.label.textContent = t('stars');
      battleStats.stars.value.textContent = `★ ${runStars}`;
    }
    if ($('mainProgress')) $('mainProgress').textContent = `${completed}/${packs[lang].length} · ${t('progress')}`;
    if ($('stageProgress') && stageStats) $('stageProgress').setAttribute('aria-label', `${t('progress')} ${completed}/${packs[lang].length}`);
  }
  function mountSharedInterface() {
    if (!window.WeightPlayScreenFrame || !window.WeightPlayPlayUI || !window.WeightPlayStageRailI9) {
      throw new Error('ANIMAL_WORD_TRAILS_I9_SHARED_RUNTIME_MISSING');
    }
    screenFrame = window.WeightPlayScreenFrame.mount({
      root: $('app'), localeSelect: $('locale'), playUI: true,
      scenes: {
        main: { root: $('mainGroup'), header: $('mainHeader'), content: $('mainContent') },
        stage: { root: $('stageScreen'), header: $('stageHeader'), headerInfo: $('stageHeaderInfo'), content: $('stageWorkspace') },
        battle: { root: $('battleScreen'), header: $('battleHeader'), headerInfo: $('battleHeaderInfo'), content: $('battleWorkspace') },
      },
    });
    stageStats = { completed: makeStat(), clues: makeStat() };
    stageStats.completed.stat.id = 'stageProgress';
    screenFrame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup()
      .add(stageStats.completed.stat).add(stageStats.clues.stat));
    battleStats = { trail: makeStat(), words: makeStat(), stars: makeStat() };
    screenFrame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup()
      .add(battleStats.trail.stat).add(battleStats.words.stat).add(battleStats.stars.stat));
    stageUI = window.WeightPlayPlayUI.mountStage({
      page: $('stageWorkspace'), rail: $('stageRail'), config: stageConfig(), selected: stage,
      onSelect(index) { stage = index; updateFrameStats(); },
      onStart(index) { stage = index; renderBattle(); },
      isActive: () => screenFrame.active === 'stage' && !$('stageScreen').hidden,
    });
    screenFrame.commonDownButton.add($('album'));
    $('album').dataset.wpFrameAction = 'secondary';
    updateFrameStats();
  }
  function waitForEntryLoader() {
    const loader = window.WeightPlayGameEntryLoader;
    if (loader?.begin && loader?.ready) return Promise.resolve(loader);
    const script = document.querySelector('script[data-wp-game-entry-loader-bootstrap="true"]');
    if (!script) return Promise.resolve(loader || null);
    return new Promise(resolve => {
      let settled = false;
      const done = () => { if (settled) return; settled = true; resolve(window.WeightPlayGameEntryLoader || null); };
      script.addEventListener('load', done, { once: true });
      script.addEventListener('error', done, { once: true });
      if (window.WeightPlayGameEntryLoader?.begin) done();
    });
  }
  async function loadGameAssets() {
    const assets = [
      '/assets/animal-word-trails-cover.webp', '/assets/animal-word-trails-forest-bg.webp',
      '/assets/animal-word-trails-safari-bg.webp', '/assets/interface7-redrawn/animal-word-trails.webp',
      '/assets/animal-word-trails-clue-cards.webp', '/assets/animal-word-trails-letter-tiles.webp',
      '/assets/animal-word-trails-lion-guide.webp', '/assets/animal-word-trails-word-clear-fx.webp',
    ];
    const loader = await waitForEntryLoader();
    loader?.begin?.(assets.length);
    let loaded = 0;
    await Promise.all(assets.map(src => new Promise(resolve => {
      const image = new Image();
      const complete = () => { loaded += 1; loader?.assetProgress?.(loaded, assets.length); resolve(); };
      image.onload = complete; image.onerror = complete; image.src = src;
    })));
    loader?.ready?.();
  }
  const battleTasks = new Map();
  let battleTasksPaused = document.hidden;
  function cancelBattleTask(key) { const task=battleTasks.get(key); if(!task)return; if(task.frame)cancelAnimationFrame(task.frame); battleTasks.delete(key); }
  function cancelBattleTasks() { [...battleTasks.keys()].forEach(cancelBattleTask); }
  function scheduleBattleTask(key, delay, callback) {
    cancelBattleTask(key);
    const task={remaining:delay,last:null,frame:0,step:null};
    task.step=now=>{
      task.frame=0;
      if(!battleTasks.has(key)||battleTasksPaused||document.hidden){task.last=null;return;}
      if(task.last===null)task.last=now;else{task.remaining-=Math.max(0,now-task.last);task.last=now;}
      if(task.remaining<=0){battleTasks.delete(key);callback();return;}
      task.frame=requestAnimationFrame(task.step);
    };
    battleTasks.set(key,task);
    if(!battleTasksPaused&&!document.hidden)task.frame=requestAnimationFrame(task.step);
  }
  function pauseBattleTasks(){ if(battleTasksPaused)return; (__wpNotifyMeasurement(), battleTasksPaused=true); const now=performance.now(); battleTasks.forEach(task=>{if(task.last!==null)task.remaining-=Math.max(0,now-task.last);task.last=null;if(task.frame)cancelAnimationFrame(task.frame);task.frame=0;}); }
  function resumeBattleTasks(){ if(!battleTasksPaused||leaveConfirmOpen)return; (__wpNotifyMeasurement(), battleTasksPaused=false); battleTasks.forEach(task=>{if(!task.frame)task.frame=requestAnimationFrame(task.step);}); }
  function restoreBoardPath(length=dragStartLength){path=path.slice(0,length);document.querySelectorAll('.tile').forEach(tile=>tile.classList.toggle('selected',path.includes(Number(tile.dataset.index))));}
  function cancelBoardPointer(event){if(boardPointerId===null||(event&&event.pointerId!==boardPointerId))return;const board=$('board');const pointerId=boardPointerId;boardPointerId=null;restoreBoardPath();try{if(board.hasPointerCapture?.(pointerId))board.releasePointerCapture(pointerId)}catch{/* The browser may already have released an interrupted pointer. */}}
  function highestUnlockedTrail(){
    const best=readRecord('wordTrailsBest');
    let highest=0;
    for(let index=1;index<packs[lang].length;index++)if(best[lang+'-'+(index-1)])highest=index;
    return highest;
  }
  function screen(name) {
    const result = name === 'result';
    const scene = result ? 'battle' : name;
    if (scene !== 'battle') { cancelBoardPointer(); cancelBattleTasks(); $('clueReveal')?.classList.add('hidden'); $('board').removeAttribute('data-word60'); document.getElementById('word60BridgeControls')?.remove(); }
    $('mainGroup').hidden = scene !== 'main';
    $('stageScreen').hidden = scene !== 'stage';
    $('battleScreen').hidden = scene !== 'battle';
    $('resultPanel').classList.toggle('hidden', !result);
    $('resultPanel').hidden = !result;
    $('battleLive').classList.toggle('hidden', result);
    $('battleLive').hidden = result;
    $('battleLive').inert = result;
    if (result) $('battleLive').setAttribute('aria-hidden', 'true');
    else $('battleLive').removeAttribute('aria-hidden');
    document.body.dataset.screen = name;
    document.body.classList.toggle('word-stage', name === 'stage');
    document.body.classList.toggle('word-playing', name === 'battle' || result);
    document.body.classList.toggle('word-result', result);
    screenFrame?.activate(scene);
    if (scene === 'stage' && stageUI) {
      stage=highestUnlockedTrail();
      stageUI.refresh(stage);
      stageUI.select(stage, { center: true, notify: false });
    }
    updateFrameStats();
    window.dispatchEvent(new Event('weightplay:battle-sync'));
    window.dispatchEvent(new Event('weightplay:stage-sync'));
    window.dispatchEvent(new Event('weightplay:shell-sync'));
    const nextScreen = result ? null : scene;
    if (result && __wpMeasurement.started && !__wpMeasurement.ended) {
      __wpMeasurement.ended = true; __wpMeasurement.outcome = 'complete';
    } else if ((nextScreen === 'main' || nextScreen === 'stage')
      && __wpMeasurement.screen === 'battle' && __wpMeasurement.started && !__wpMeasurement.ended) {
      __wpMeasurement.ended = true; __wpMeasurement.outcome = 'abandon';
    }
    __wpMeasurement.screen = nextScreen;
    __wpNotifyMeasurement();
  }
  function translate(){
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.textContent = el.hasAttribute('data-wp-game-title')
        ? (window.WeightPlayOfficialName?.title?.() || t(el.dataset.copy)) : t(el.dataset.copy);
    });
    document.querySelectorAll('[data-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.aria)));
    if ($('locale')) $('locale').value = lang;
    if ($('mainPoster')) $('mainPoster').alt = t('title');
    updateFrameStats();
  }
  function save(){ writeStorage('wordTrailsLocale',lang); writeStorage('weightPlayLocale',lang); writeStorage('wordTrailsBest',JSON.stringify(readRecord('wordTrailsBest'))); }
  function renderStages(){ if(!stageUI)return; stageUI.refresh(stage); stageUI.select(stage,{center:true}); updateFrameStats(); }
  function neighbors(a,b){ const size=packs[lang][stage].size||4;return Math.abs(Math.floor(a/size)-Math.floor(b/size))<=1 && Math.abs(a%size-b%size)<=1; }
  function renderBattle(){ const data=packs[lang][stage]; path=[]; found=new Set(); hints=0; $('battleTitle').textContent=data.name; $('objective').textContent=t('objective'); $('foundCount').textContent=`0/${data.words.length}`; $('starCount').textContent='★ 0'; $('targets').innerHTML=data.words.map(w=>`<span class="target" data-word="${w}">${w}</span>`).join(''); const board=$('board'); board.innerHTML=''; data.board.forEach((letter,i)=>{const b=document.createElement('button');b.className='tile';b.dataset.index=i;b.textContent=letter;b.addEventListener('click',()=>select(i));b.addEventListener('pointerenter',e=>{if(e.buttons)select(i)});board.append(b)}); board.onpointerdown=e=>{if(e.target.matches('.tile')){dragStartLength=path.length;board.setPointerCapture(e.pointerId);select(+e.target.dataset.index)}}; board.onpointerup=()=>{if(path.length-dragStartLength>1)submit()}; $('feedback').textContent=t('connect'); screen('battle'); }
  function select(i){ const data=packs[lang][stage]; if(data.blocked?.includes(i)||path.includes(i)) return; if(path.length && !neighbors(path.at(-1),i)){ path=[i]; $('feedback').textContent=t('newPath'); document.querySelectorAll('.tile').forEach(x=>x.classList.toggle('selected',path.includes(+x.dataset.index))); return; } if(data.oneWay?.index===i && path.length && path.at(-1)!==data.oneWay.from){ $('feedback').textContent=t('oneWay'); return; } path.push(i); document.querySelectorAll('.tile').forEach(x=>x.classList.toggle('selected',path.includes(+x.dataset.index))); }
  function clear(){ path=[];document.querySelectorAll('.tile').forEach(x=>x.classList.remove('selected','correct'));$('feedback').textContent=''; }
  function submit(){ const data=packs[lang][stage], word=path.map(i=>data.board[i]).join(''); if(!data.words.includes(word)||found.has(word)){ $('feedback').textContent=t('try'); clear(); return; } found.add(word); document.querySelector(`[data-word="${word}"]`).classList.add('done'); path.forEach(i=>document.querySelector(`.tile[data-index="${i}"]`).classList.add('correct')); $('feedback').textContent=t('great'); $('foundCount').textContent=`${found.size}/${data.words.length}`; $('starCount').textContent=`★ ${Math.max(1,3-hints)}`; if(found.size===data.words.length) setTimeout(result,450); else setTimeout(clear,420); }
  function hint(){ const data=packs[lang][stage], word=data.words.find(w=>!found.has(w)); if(!word)return; const target=data.legacyLocalized?data.legacyTargets.find(item=>item.display===word):null; const ix=target?target.path[0]:data.board.findIndex(l=>l===word[0]); if(ix<0)return; hints++; track('word_trails_hint_used', { hints_used: hints }); window.WeightPlayAudio?.play("ui.click"); clear(); select(ix); $('feedback').textContent=`${t('hint')}: ${data.board[ix]}`; }
  function result(){ const key=lang+'-'+stage, best=readRecord('wordTrailsBest'), stars=Math.max(1,3-hints); best[key]=Math.max(best[key]||0,stars);writeStorage('wordTrailsBest',JSON.stringify(best)); $('resultSummary').textContent=`${found.size} ${t('found')} · ★ ${stars}`; screen('result'); }
  function renderStages(){ if(!stageUI)return; stageUI.refresh(stage); stageUI.select(stage,{center:true}); updateFrameStats(); }
  function renderBattle(){ cancelBoardPointer(); cancelBattleTasks(); $('clueReveal')?.classList.add('hidden'); const data=packs[lang][stage]; path=[]; found=new Set(); hints=0; $('battleTitle').textContent=data.name; $('objective').textContent=t('objective'); $('foundCount').textContent=`0/${data.words.length}`; $('starCount').textContent='\u2605 0'; $('targets').innerHTML=data.words.map(w=>`<span class="target" data-word="${w}">${w}</span>`).join(''); const board=$('board'); board.style.setProperty('--grid-size',String(data.size||4));board.innerHTML=''; data.board.forEach((letter,i)=>{const b=document.createElement('button');b.className='tile'+(data.blocked?.includes(i)?' blocked':'');b.disabled=Boolean(data.blocked?.includes(i));b.dataset.index=i;b.textContent=letter;b.addEventListener('click',()=>select(i));board.append(b)}); board.onpointerdown=e=>{const wrongMouseButton=e.pointerType==='mouse'&&e.button!==0;if(!e.target.matches('.tile')||!e.isPrimary||wrongMouseButton||boardPointerId!==null||leaveConfirmOpen)return;boardPointerId=e.pointerId;dragStartLength=path.length;try{board.setPointerCapture?.(e.pointerId)}catch{/* Synthetic and already-ended pointers cannot be captured. */}select(+e.target.dataset.index)}; board.onpointermove=e=>{if(e.pointerId!==boardPointerId)return;const tile=document.elementFromPoint(e.clientX,e.clientY)?.closest('.tile');if(tile&&board.contains(tile))select(+tile.dataset.index)}; board.onpointerup=e=>{if(e.pointerId!==boardPointerId)return;const shouldSubmit=path.length-dragStartLength>1;const pointerId=boardPointerId;boardPointerId=null;try{if(board.hasPointerCapture?.(pointerId))board.releasePointerCapture(pointerId)}catch{/* The browser may already have released the pointer. */}if(shouldSubmit)submit()}; board.onpointercancel=cancelBoardPointer; board.onlostpointercapture=e=>cancelBoardPointer(e); $('feedback').textContent=t('connect'); screen('battle'); requestAnimationFrame(()=>board.querySelector('.tile:not(:disabled)')?.focus({preventScroll:true}));
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function submit(){ const data=packs[lang][stage], word=data.legacyLocalized?legacyWordForPath(data,path):path.map(i=>data.board[i]).join(''); if(!word||!data.words.includes(word)||found.has(word)){ clear(); $('feedback').textContent=t('try'); return; } found.add(word); [...$('targets').querySelectorAll('[data-word]')].find(node=>node.dataset.word===word)?.classList.add('done'); path.forEach(i=>document.querySelector(`.tile[data-index="${i}"]`).classList.add('correct')); $('feedback').textContent=t('great'); $('foundCount').textContent=`${found.size}/${data.words.length}`; $('starCount').textContent=`\u2605 ${Math.max(1,3-hints)}`; scheduleBattleTask('transition',found.size===data.words.length?450:420,found.size===data.words.length?result:clear); }
  function result(){ const key=lang+'-'+stage, best=readRecord('wordTrailsBest'), stars=Math.max(1,3-hints), terminal=stage>=packs[lang].length-1; best[key]=Math.max(best[key]||0,stars);writeStorage('wordTrailsBest',JSON.stringify(best)); stageUI?.refresh(stage); updateFrameStats(); track('word_trails_stage_complete', { words_found: found.size, hints_used: hints, stars }); window.WeightPlayAudio?.play("result.win"); $('resultSummary').textContent=`${found.size} ${t('found')} \u00b7 \u2605 ${stars}`; $('next').disabled=terminal; $('next').setAttribute('aria-disabled',String(terminal)); $('next').classList.toggle('primary',!terminal); $('next').classList.toggle('secondary',terminal); (__wpNotifyMeasurement(), $('resultsBack').classList.toggle('primary',terminal)); (__wpNotifyMeasurement(), $('resultsBack').classList.toggle('secondary',!terminal)); $('replay').classList.remove('primary'); $('replay').classList.add('secondary'); resultActionClaimed=false; screen('result'); requestAnimationFrame(()=>(terminal?$('resultsBack'):$('next')).focus({preventScroll:true}));
    __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function claimResultAction(){ if($('resultPanel').classList.contains('hidden')||resultActionClaimed)return false; resultActionClaimed=true; return true; }
  const baseRenderBattle = renderBattle;
  renderBattle = function(){
    baseRenderBattle();
    runStars=0;
    updateFrameStats();
    $('playScene').dataset.habitat=stage>=3&&stage<=4?'safari':'forest';
    const rule=packs[lang][stage].rule;
    if(rule)$('objective').textContent=rule;
  };
  renderStages = function(){
    if (!stageUI) return;
    stageUI.refresh(stage);
    stageUI.select(stage, { center:true });
    updateFrameStats();
  };
  function reveal(word){
    const panel=$('clueReveal');
    const effectPositions=['0%','33.333%','66.667%','100%'];
    $('clueTitle').textContent=`${t('clueFound')} ${word}`;
    $('clearFx').style.backgroundPosition=`${effectPositions[(found.size-1)%effectPositions.length]} center`;
    panel.classList.remove('hidden');
    scheduleBattleTask('reveal',850,()=>panel.classList.add('hidden'));
  }
  function undo(){
    if(!path.length) return;
    path.pop();
    document.querySelectorAll('.tile').forEach(x=>x.classList.toggle('selected',path.includes(+x.dataset.index)));
    $('feedback').textContent='';
    window.WeightPlayAudio?.play("ui.click");
  }
  const originalSubmit = submit;
  submit = function(){ const before=found.size; originalSubmit(); if(found.size>before){ runStars=Math.max(1,3-hints); const word=[...found].at(-1); const album=readRecord('wordTrailsAlbum'); album[lang+'-'+word]=true; writeStorage('wordTrailsAlbum',JSON.stringify(album)); track('word_trails_word_found', { words_found: found.size, word_length: word.length }); window.WeightPlayAudio?.play("feedback.success"); reveal(word); updateFrameStats(); } else { window.WeightPlayAudio?.play("feedback.error"); } };
  // New trails use stable concept IDs for rules, while the existing album and
  // public run snapshot continue to store the localized display word.
  let word60Target=null, word60Committed=null, word60Bridge=null;
  let checkpointTarget=null;
  const extended=()=>Boolean(packs[lang]?.[stage]?.word60);
  const legacyCheckpoint=()=>Boolean(stage60Packs && (stage===4 || stage===9));
  const word60Copy=()=>window.WordTrailsStage60Copy[lang];
  function word60State(){
    const data=packs[lang][stage];
    return {path,found:new Set(data.targets.filter(item=>found.has(item.display)).map(item=>item.id)),target:word60Target,committedCategory:word60Committed,bridge:word60Bridge};
  }
  function word60Feedback(reason){
    const c=word60Copy();
    $('feedback').textContent=c[reason] || t(reason==='notAdjacent'?'newPath':'try');
  }
  function word60Sync(){
    const data=packs[lang][stage], state=word60State(), c=word60Copy();
    const allowed=window.WordTrailsStage60Rules.allowedCategory(data,state.found,state.committedCategory);
    for(const node of $('targets').querySelectorAll('button[data-target-id]')){
      const target=data.targets.find(item=>item.id===node.dataset.targetId);
      const done=state.found.has(target.id), locked=Boolean(allowed&&target.category!==allowed);
      node.classList.toggle('done',done);node.setAttribute('aria-pressed',String(word60Target===target.id));node.setAttribute('aria-disabled',String(done||locked));
      const category=target.category==='animal'?c.animalCategory:c.natureCategory;
      node.setAttribute('aria-label',[target.display,category,locked?c.lockedCategory:''].filter(Boolean).join(' · '));
    }
    for(const node of document.querySelectorAll('#word60BridgeControls button[data-bridge-index]'))node.setAttribute('aria-pressed',String(Number(node.dataset.bridgeIndex)===word60Bridge));
    for(const node of $('board').querySelectorAll('.word60-bridge-cell'))node.classList.toggle('is-open',Number(node.dataset.index)===word60Bridge);
    $('objective').textContent=data.categoryOrder?(allowed?(allowed==='animal'?c.animalCategory:c.natureCategory):c.chooseCategory):t('stageSummary',{n:data.targets.length});
  }
  function word60ClearPath(){path=[];$('board').querySelectorAll('.tile').forEach(node=>node.classList.remove('selected','correct'));}
  function prepareNextWord(){
    if(!battleTasks.has('transition'))return true;
    // A final word owns the pending Result; earlier words can settle their
    // visual path immediately when the player starts the next action.
    if(found.size>=packs[lang][stage].words.length)return false;
    cancelBattleTask('transition');word60ClearPath();dragStartLength=0;return true;
  }
  function syncLegacyCheckpoint(){
    const data=packs[lang][stage], expected=stage===9?data.words[found.size]:checkpointTarget;
    for(const node of $('targets').querySelectorAll('.target[data-word]')){
      const selected=node.dataset.word===expected,done=found.has(node.dataset.word);
      node.classList.toggle('done',done);node.classList.toggle('checkpoint-active',selected);
      if(node.tagName==='BUTTON'){node.setAttribute('aria-pressed',String(selected));node.setAttribute('aria-disabled',String(done));}
      else if(selected)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');
    }
    $('objective').textContent=t(stage===4?'checkpointChoose':'checkpointOrder');
  }
  function checkpointPath(data,word){
    const known=data.legacyTargets?.find(item=>item.display===word);
    if(known)return known.path;
    const tokens=Array.from(word),size=data.size||4,blocked=new Set(data.blocked||[]);
    function visit(cell,at,seen){
      if(blocked.has(cell)||seen.includes(cell)||data.board[cell]!==tokens[at])return null;
      const route=[...seen,cell];if(at===tokens.length-1)return route;
      for(let next=0;next<data.board.length;next++){
        if(!neighbors(cell,next)||data.oneWay?.index===next&&data.oneWay.from!==cell)continue;
        const candidate=visit(next,at+1,route);if(candidate)return candidate;
      }
      return null;
    }
    for(let cell=0;cell<data.board.length;cell++){const route=visit(cell,0,[]);if(route)return route;}
    return null;
  }
  const oldWord60Select=select;
  select=function(index){
    if(leaveConfirmOpen||!prepareNextWord())return;
    if(!extended()){
      if(legacyCheckpoint()&&stage===4&&!checkpointTarget){$('feedback').textContent=t('checkpointChoose');return;}
      return oldWord60Select(index);
    }
    const decision=window.WordTrailsStage60Rules.append(packs[lang][stage],word60State(),index);
    if(!decision.ok){if(decision.reason!=='unavailable')word60Feedback(decision.reason);return;}
    path=decision.path;$('board').querySelectorAll('.tile').forEach(node=>node.classList.toggle('selected',path.includes(Number(node.dataset.index))));
    $('feedback').textContent='';
  };
  const oldWord60Clear=clear;
  clear=function(){if(!prepareNextWord())return;if(!extended())return oldWord60Clear();word60ClearPath();$('feedback').textContent='';};
  const oldWord60Undo=undo;
  undo=function(){if(!prepareNextWord())return;if(!extended())return oldWord60Undo();if(!path.length)return;path=path.slice(0,-1);$('board').querySelectorAll('.tile').forEach(node=>node.classList.toggle('selected',path.includes(Number(node.dataset.index))));$('feedback').textContent='';window.WeightPlayAudio?.play('ui.click');};
  const oldWord60Submit=submit;
  submit=function(){
    if(!extended()){
      if(!legacyCheckpoint())return oldWord60Submit();
      if(!prepareNextWord()||leaveConfirmOpen)return;
      const data=packs[lang][stage];
      const word=data.legacyLocalized?legacyWordForPath(data,path):path.map(index=>data.board[index]).join('');
      const expected=stage===4?checkpointTarget:data.words[found.size];
      if(!expected||word!==expected){word60ClearPath();$('feedback').textContent=t(!expected?'checkpointChoose':'checkpointWrong');window.WeightPlayAudio?.play('feedback.error');return;}
      const before=found.size;oldWord60Submit();
      if(found.size>before){checkpointTarget=null;syncLegacyCheckpoint();}
      return;
    }
    if(!prepareNextWord()||leaveConfirmOpen)return;
    const decision=window.WordTrailsStage60Rules.submit(packs[lang][stage],word60State());
    if(!decision.ok){word60ClearPath();word60Feedback(decision.reason);window.WeightPlayAudio?.play('feedback.error');return;}
    const target=decision.target;word60Committed=decision.committedCategory;word60Target=null;found.add(target.display);
    for(const node of $('targets').querySelectorAll('.target[data-word]'))if(node.dataset.word===target.display)node.classList.add('done');
    path.forEach(index=>$('board').querySelector(`.tile[data-index="${index}"]`)?.classList.add('correct'));
    $('foundCount').textContent=`${found.size}/${packs[lang][stage].targets.length}`;runStars=Math.max(1,3-hints);$('starCount').textContent=`★ ${runStars}`;
    const album=readRecord('wordTrailsAlbum');album[lang+'-'+target.display]=true;writeStorage('wordTrailsAlbum',JSON.stringify(album));
    track('word_trails_word_found',{words_found:found.size,word_length:target.tokens.length});window.WeightPlayAudio?.play('feedback.success');reveal(target.display);updateFrameStats();word60Sync();$('feedback').textContent=t('great');
    scheduleBattleTask('transition',found.size===packs[lang][stage].targets.length?450:420,found.size===packs[lang][stage].targets.length?result:clear);
  };
  const oldWord60Hint=hint;
  hint=function(){
    if(!extended()){
      if(!legacyCheckpoint())return oldWord60Hint();
      if(!prepareNextWord()||leaveConfirmOpen)return;
      const data=packs[lang][stage],word=stage===4?(checkpointTarget||data.words.find(item=>!found.has(item))):data.words[found.size];
      const route=word&&checkpointPath(data,word);if(!route?.length){$('feedback').textContent=t('try');return;}
      cancelBoardPointer();word60ClearPath();if(stage===4)checkpointTarget=word;
      select(route[0]);hints++;track('word_trails_hint_used',{hints_used:hints});window.WeightPlayAudio?.play('ui.click');
      $('feedback').textContent=`${t('hint')}: ${data.board[route[0]]}`;syncLegacyCheckpoint();return;
    }
    if(!prepareNextWord())return;
    const data=packs[lang][stage],rules=window.WordTrailsStage60Rules,state=word60State();
    const target=data.targets.find(item=>!state.found.has(item.id)&&(!data.categoryOrder||rules.chooseTarget(data,state,item.id).ok)&&(item.bridge==null||item.bridge===word60Bridge));
    if(!target){word60Feedback(data.bridges?.length?'bridgeBlocked':'try');return;}
    const probe=rules.append(data,{...state,path:[],target:data.categoryOrder?target.id:null},target.path[0]);
    if(!probe.ok){word60Feedback(probe.reason);return;}
    cancelBoardPointer();word60ClearPath();word60Target=data.categoryOrder?target.id:null;path=probe.path;
    $('board').querySelector(`.tile[data-index="${path[0]}"]`)?.classList.add('selected');hints++;track('word_trails_hint_used',{hints_used:hints});window.WeightPlayAudio?.play('ui.click');
    $('feedback').textContent=`${t('hint')}: ${data.wildcards?.includes(path[0])?word60Copy().wildLeaf:data.board[path[0]]}`;word60Sync();
  };
  const oldWord60Render=renderBattle;
  renderBattle=function(){
    word60Target=null;word60Committed=null;word60Bridge=null;checkpointTarget=null;
    document.getElementById('word60BridgeControls')?.remove();$('board').removeAttribute('data-word60');
    oldWord60Render();$('board').style.direction=packs[lang][stage].legacyLocalized?'ltr':'';
    $('board').toggleAttribute('data-legacy-localized',Boolean(packs[lang][stage].legacyLocalized));
    if(!extended()){
      if(legacyCheckpoint()){
        const data=packs[lang][stage];
        if(stage===4){
          $('targets').replaceChildren();
          for(const word of data.words){
            const button=document.createElement('button');button.type='button';button.className='target word60-target';button.dataset.word=word;button.textContent=word;
            button.addEventListener('click',()=>{if(leaveConfirmOpen||found.has(word)||!prepareNextWord())return;cancelBoardPointer();word60ClearPath();checkpointTarget=word;$('feedback').textContent='';syncLegacyCheckpoint();});
            $('targets').append(button);
          }
        }
        syncLegacyCheckpoint();$('feedback').textContent=t(stage===4?'checkpointChoose':'checkpointOrder');
      }
      return;
    }
    const data=packs[lang][stage],c=word60Copy(),board=$('board');board.setAttribute('data-word60','');
    if(data.categoryOrder){
      $('targets').replaceChildren();
      for(const target of data.targets){
        const button=document.createElement('button');button.type='button';button.className='target word60-target';button.dataset.targetId=target.id;button.dataset.word=target.display;button.textContent=target.display;
        button.addEventListener('click',()=>{if(leaveConfirmOpen||!prepareNextWord())return;const decision=window.WordTrailsStage60Rules.chooseTarget(data,word60State(),target.id);if(!decision.ok){word60Feedback(decision.reason);return;}if(word60Target!==target.id){cancelBoardPointer();word60ClearPath();word60Target=target.id;}$('feedback').textContent='';word60Sync();});
        $('targets').append(button);
      }
    }
    if(data.bridges?.length){
      const controls=document.createElement('div');controls.id='word60BridgeControls';controls.className='word60-bridge-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label',c.moveBridge);
      data.bridges.forEach((index,position)=>{const button=document.createElement('button');button.type='button';button.className='word60-bridge-button';button.dataset.bridgeIndex=String(index);button.textContent=`${c.bridge} ${new Intl.NumberFormat(lang).format(position+1)}`;button.addEventListener('click',()=>{if(leaveConfirmOpen||!prepareNextWord())return;const decision=window.WordTrailsStage60Rules.moveBridge(data,word60State(),index);if(!decision.ok){word60Feedback(decision.reason);return;}cancelBoardPointer();word60Bridge=decision.bridge;word60ClearPath();$('feedback').textContent=c.bridgeChosen;word60Sync();});controls.append(button);});board.before(controls);
    }
    for(const tile of board.querySelectorAll('.tile')){
      const index=Number(tile.dataset.index), parts=[data.board[index]];
      if(data.bridges?.includes(index)){const label=new Intl.NumberFormat(lang).format(data.bridges.indexOf(index)+1);tile.classList.add('word60-bridge-cell');tile.dataset.bridgeIndex=String(index);tile.dataset.bridgeLabel=label;parts.push(`${c.bridge} ${label}`);}
      if(data.wildcards?.includes(index)){tile.classList.add('word60-wild-cell');tile.setAttribute('data-wild-leaf','');parts.push(c.wildLeaf);}
      const arrow=data.oneWays?.find(item=>item.index===index);
      if(arrow){tile.classList.add('word60-oneway-cell');tile.dataset.onewayFrom=String(arrow.from);tile.dataset.onewayDx=String(index%data.size-arrow.from%data.size);tile.dataset.onewayDy=String(Math.floor(index/data.size)-Math.floor(arrow.from/data.size));parts.push(`${c.wrongDirection} ${new Intl.NumberFormat(lang).format(Math.floor(arrow.from/data.size)+1)}, ${new Intl.NumberFormat(lang).format(arrow.from%data.size+1)}`);}
      tile.setAttribute('aria-label',parts.filter(Boolean).join(' · '));
    }
    word60Sync();
    if(data.bridges?.length)$('feedback').textContent=c.bridgeBlocked;
    else if(data.categoryOrder)$('feedback').textContent=c.selectTarget;
  };
  Object.assign(copy.en, {
    language:'Language', album:'Album', albumTitle:'Animal clues', undo:'Undo', loading:'Loading trail',
    backLobby:'Back to WeightPlay', backMain:'Back to main', backStage:'Back to trails', closeAlbum:'Close album', stages:'Trails', board:'Word board',
    lockedStage:'Finish the previous trail to unlock this one.', leaveTitle:'Leave this trail?', leaveMessage:'Found words, the current path, and star progress in this run will reset.', keepReading:'Keep reading', leaveTrail:'Leave trail',
    seoTitle:'Animal Word Trails - WeightPlay', seoDescription:'Connect animal and habitat words in a calm reading puzzle.', words:'words', cards:'Cards', objective:'Find the animal words', connect:'Connect adjacent tiles.', newPath:'New path started here.', oneWay:'Follow the leaf direction.', clueFound:'Clue found:',
    progress:'Trails completed', trail:'Trail', trailNumber:'Trail {n}', stageSummary:'Find {n} words to complete this trail.', locked:'Finish the previous trail to unlock this one.', completed:'Completed', available:'Ready', stars:'Stars'
  });
  Object.assign(copy['zh-Hant'], {
    replay:'再玩一次',
    language:'\u8a9e\u8a00', album:'\u7dda\u7d22\u5361', albumTitle:'\u52d5\u7269\u7dda\u7d22\u5361', undo:'\u5fa9\u539f', loading:'\u6e96\u5099\u5c0f\u5f91',
    backLobby:'\u8fd4\u56de WeightPlay \u5927\u5ef3', backMain:'\u8fd4\u56de\u9996\u9801', backStage:'\u8fd4\u56de\u5c0f\u5f91\u9078\u55ae', closeAlbum:'\u95dc\u9589\u7dda\u7d22\u5361',
    stages:'\u5c0f\u5f91\u9078\u55ae', board:'\u5b57\u8a5e\u68cb\u76e4', seoTitle:'\u52d5\u7269\u5b57\u8a5e\u5c0f\u5f91 - WeightPlay', words:'\u500b\u5b57\u8a5e', cards:'\u7dda\u7d22\u5361', objective:'\u627e\u51fa\u52d5\u7269\u5b57\u8a5e', connect:'\u9023\u63a5\u76f8\u9130\u7684\u5b57\u8a5e\u683c\u3002', newPath:'\u5df2\u5f9e\u9019\u4e00\u683c\u91cd\u65b0\u958b\u59cb\u3002', oneWay:'\u8acb\u9806\u8457\u8449\u7247\u65b9\u5411\u524d\u9032\u3002', clueFound:'\u627e\u5230\u52d5\u7269\u7dda\u7d22\uff1a',
    lockedStage:'\u5b8c\u6210\u524d\u4e00\u689d\u5c0f\u5f91\uff0c\u5c31\u80fd\u89e3\u9396\u9019\u4e00\u95dc\u3002', leaveTitle:'\u8981\u96e2\u958b\u9019\u689d\u5c0f\u5f91\u55ce\uff1f', leaveMessage:'\u9019\u4e00\u5c40\u627e\u5230\u7684\u5b57\u8a5e\u3001\u76ee\u524d\u8def\u5f91\u548c\u661f\u661f\u9032\u5ea6\u90fd\u6703\u91cd\u8a2d\u3002', keepReading:'\u7e7c\u7e8c\u627e\u5b57', leaveTrail:'\u96e2\u958b\u5c0f\u5f91',
    seoDescription:'\u9023\u7dda\u627e\u51fa\u52d5\u7269\u8207\u68f2\u5730\u5b57\u8a5e\u7684\u8f15\u9b06\u95b1\u8b80\u904a\u6232\u3002',
    progress:'\u5df2\u5b8c\u6210\u5c0f\u5f91', trail:'\u5c0f\u5f91', trailNumber:'\u7b2c {n} \u689d\u5c0f\u5f91',
    stageSummary:'\u627e\u51fa {n} \u500b\u5b57\u8a5e\uff0c\u5b8c\u6210\u9019\u689d\u5c0f\u5f91\u3002',
    locked:'\u5b8c\u6210\u524d\u4e00\u689d\u5c0f\u5f91\u5c31\u80fd\u89e3\u9396\u3002', completed:'\u5df2\u5b8c\u6210', available:'\u53ef\u6311\u6230', stars:'\u661f\u661f'
  });
  translate = function(){
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    app.dataset.locale = lang;
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.textContent = el.hasAttribute('data-wp-game-title')
        ? (window.WeightPlayOfficialName?.title?.() || t(el.dataset.copy)) : t(el.dataset.copy);
    });
    document.querySelectorAll('[data-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.aria)));
    if ($('locale')) $('locale').value = lang;
    if ($('mainPoster')) $('mainPoster').alt = t('title');
    updateFrameStats();
  };
  const rejectRepeatedActivation=event=>{
    if(event.repeat&&(event.key==='Enter'||event.key===' ')){event.preventDefault();event.stopImmediatePropagation();}
  };
  const focusSelectedStage=()=>requestAnimationFrame(()=>document.querySelector('.stage-card[aria-current="true"]')?.focus({preventScroll:true}));
  function setLeaveConfirmOpen(open,restoreFocus=true){
    if(open===leaveConfirmOpen)return;
    const panel=$('leaveConfirmPanel'),live=$('battleLive');
    (__wpNotifyMeasurement(), leaveConfirmOpen=open);
    panel.classList.toggle('hidden',!open);panel.hidden=!open;
    live.inert=open;
    if(open){
      leaveConfirmTrigger=document.activeElement instanceof HTMLElement?document.activeElement:$('battleBack');
      pauseBattleTasks();
      live.setAttribute('aria-hidden','true');
      screenFrame?.activate('battle',{covered:true});
      requestAnimationFrame(()=>$('keepReading').focus({preventScroll:true}));
    }else{
      live.removeAttribute('aria-hidden');
      screenFrame?.activate('battle');
      resumeBattleTasks();
      const trigger=leaveConfirmTrigger;
      leaveConfirmTrigger=null;
      if(restoreFocus&&trigger?.isConnected)trigger.focus({preventScroll:true});
    }
  }
  function returnToTrails(){screen('stage');stageUI?.select(stage,{center:true,focus:true});}
  function requestBattleReturn(){if(path.length===0&&found.size===0&&hints===0&&battleTasks.size===0){returnToTrails();return}setLeaveConfirmOpen(true)}
  function leaveCurrentTrail(){setLeaveConfirmOpen(false,false);returnToTrails()}
  $('start').addEventListener('keydown',rejectRepeatedActivation);
  $('battleBack').addEventListener('keydown',rejectRepeatedActivation);
  $('resultPanel').addEventListener('keydown',event=>{
    rejectRepeatedActivation(event);
    if(event.defaultPrevented||event.key!=='Tab'||$('resultPanel').classList.contains('hidden'))return;
    const actions=[...$('resultPanel').querySelectorAll('button:not(.hidden):not(:disabled)')]
      .filter(action=>action.getClientRects().length>0);
    if(actions.length===0)return;
    const first=actions[0],last=actions[actions.length-1];
    if((event.shiftKey&&document.activeElement===first)||(!event.shiftKey&&document.activeElement===last)){
      event.preventDefault();(event.shiftKey?last:first).focus({preventScroll:true});
    }
  },true);
  $('leaveConfirmPanel').addEventListener('keydown',event=>{
    rejectRepeatedActivation(event);
    if(event.defaultPrevented)return;
    if(event.key==='Escape'){event.preventDefault();setLeaveConfirmOpen(false,true);return;}
    if(event.key!=='Tab')return;
    const actions=[$('keepReading'),$('leaveTrail')],index=actions.indexOf(document.activeElement);
    const next=event.shiftKey?(index<=0?actions.length-1:index-1):(index>=actions.length-1?0:index+1);
    event.preventDefault();actions[next].focus({preventScroll:true});
  },true);
  addEventListener('blur',()=>{cancelBoardPointer();pauseBattleTasks()});
  addEventListener('focus',resumeBattleTasks);
  addEventListener('pagehide',()=>{cancelBoardPointer();pauseBattleTasks()});
  addEventListener('pageshow',resumeBattleTasks);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelBoardPointer();pauseBattleTasks()}else resumeBattleTasks();});
  const localeControl=$('locale');
  localeControl.onchange=()=>{
    const next=localeControl.value;
    writeStorage('wordTrailsLocale',next);writeStorage('weightPlayLocale',next);
    if(window.WonderI18n?.setLocale){window.WonderI18n.setLocale(next);return;}
    lang=next;if(!packs[lang]){packs[lang]=packs.en.slice(0,10).map((source,index)=>buildLocalizedStage(source,index,lang));migrateLegacyAlbum(lang);}
    if(stage60Packs&&packs[lang].length===10)packs[lang]=packs[lang].concat(stage60Packs[lang]);
    stage=0;save();translate();stageUI?.refresh(stage);stageUI?.select(stage,{center:true});
  };
  $('start').onclick=()=>{track('game_start');screen('stage');stageUI.select(stage,{center:true,focus:true});};
  $('stageBack').onclick=()=>{screen('main');requestAnimationFrame(()=>requestAnimationFrame(()=>$('start').focus({preventScroll:true})));};
  $('battleBack').onclick=requestBattleReturn;
  $('keepReading').onclick=()=>setLeaveConfirmOpen(false,true);
  $('leaveTrail').onclick=leaveCurrentTrail;
  $('clear').onclick=clear;
  $('undo').onclick=undo;
  $('hint').onclick=hint;
  $('submit').onclick=submit;
  $('replay').onclick=()=>{if(!claimResultAction())return;__wpReplayStart(() => renderBattle());};
  $('next').onclick=()=>{if(!claimResultAction())return;stage=Math.min(stage+1,packs[lang].length-1);renderBattle();};
  $('resultsBack').onclick=()=>{if(!claimResultAction())return;screen('stage');stageUI.select(stage,{center:true,focus:true});};
  $('album').onclick=()=>{
    const album=readRecord('wordTrailsAlbum'),groups=currentAlbumGroups(album),list=$('albumList');
    const animalArt={LION:0,FOX:1,BEAR:2,RABBIT:3,OWL:4,FROG:5,WHALE:6,DOLPHIN:7,GIRAFFE:8,ELEPHANT:9,PENGUIN:10,TURTLE:11};
    list.replaceChildren();
    // These mementos are a projection of saved clears, not a second reward.
    const best=readRecord('wordTrailsBest'),copy=window.WordTrailsStage60Copy?.[lang];
    for(const number of [15,20,25,30])if(best[lang+'-'+(number-1)]){
      const mark=document.createElement('span');mark.className='word60-memento';
      mark.textContent=`${copy?.checkpoint || t('completed')} ${new Intl.NumberFormat(lang).format(number)}`;
      list.append(mark);
    }
    groups.forEach(item=>{
      const card=document.createElement('span');card.className=item.unlocked?'card':'locked';
      if(item.unlocked){
        const image=animalArt[item.id];
        if(Number.isInteger(image))card.style.backgroundPosition=`${(image%4)*33.333}% ${Math.floor(image/4)*50}%`;
        else card.classList.add('word60-generic-card');
      }
      card.textContent=item.unlocked?item.display:'?';list.append(card);
    });
    (__wpNotifyMeasurement(), $('albumDialog').showModal());
  };
  $('closeAlbum').onclick=()=>(__wpNotifyMeasurement(), $('albumDialog').close());
  window.__animalWordTrailsTest={snapshot:()=>({stage,path:[...path],found:[...found],hints,tasks:[...battleTasks.keys()],tasksPaused:battleTasksPaused,leaveConfirmOpen,activeScene:screenFrame?.active||null})};
  async function boot(){
    installStage60();
    mountSharedInterface();
    translate();
    stageUI.refresh(stage);
    screen('main');
    window.WonderI18n?.setLocale?.(lang,{navigate:false});
    track('game_view');
    await loadGameAssets();
  }
  boot().catch(error=>{
    window.WeightPlayGameEntryLoader?.fail?.();
    console.error('ANIMAL_WORD_TRAILS_I9_BOOT_FAILED',error);
  });
})();
