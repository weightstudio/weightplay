/* Tide Level Calibration v4: authored campaign and deterministic transactions. */
(function (root) {
  'use strict';
  const VERSION = 4, TOTAL = 30, READINGS = 5;
  const SAVE_KEY = 'weightplay-tideglass-campaign-v1';
  const targets = [
    [36,64,48,72,24], [18,52,82,42,68], [28,76,44,62,34], [84,22,58,38,74], [46,66,26,78,54],
    [32,68,44,76,24], [62,28,82,48,36], [74,42,22,66,54], [38,78,58,26,72], [56,34,84,46,64],
    [42,64,28,76,52], [68,36,82,48,24], [32,72,54,26,62], [78,44,22,66,38], [58,28,74,46,82],
    [30,70,45,60,25], [65,35,80,40,55], [20,75,50,30,65], [60,25,70,45,35], [55,80,40,20,75],
    [20,40,60,80,50], [25,75,50,20,60], [30,70,40,90,10], [15,35,65,85,45], [55,75,25,60,40],
    [34,68,45,60,78], [72,26,55,25,42], [46,82,30,75,64], [62,38,70,35,24], [78,54,25,65,42]
  ];
  const modeNames = ['read','memory','offset','balance','fraction','mixed'];
  const offsets = [-12,8,-7,15,-10];
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  const clamp = n => Math.max(0, Math.min(100, Number.isFinite(Number(n)) ? Number(n) : 0));
  const stages = targets.map((row,index) => {
    const arc = Math.floor(index/5), local = index%5;
    const rounds = row.map((target,j) => {
      const mode = arc === 5 ? ['memory','offset','balance','fraction','read'][j] : modeNames[arc];
      const divisor = gcd(target,100);
      const bias = mode === 'offset' ? offsets[(local+j)%offsets.length] : 0;
      const tolerance = arc === 5 ? (index === 29 ? 1 : 2) : (local === 4 ? 2 : 3);
      return Object.freeze({mode,target,bias,tolerance,numerator:target/divisor,denominator:100/divisor,
        initial: mode === 'offset' ? 50-bias : 12 + ((index*13+j*17)%70)});
    });
    return Object.freeze({id:index+1,arc:arc+1,mode:modeNames[arc],checkpoint:local===4,rounds:Object.freeze(rounds)});
  });
  Object.freeze(stages);
  function readProgress(text) {
    let data;
    try { data = JSON.parse(text || 'null'); } catch { data = null; }
    const source = data?.schema === 1 && Array.isArray(data.best) ? data.best : [];
    let gap = false;
    const best = Array.from({length:TOTAL}, (_,i) => {
      const value = source[i];
      if (gap || !value || !Number.isInteger(value.stars) || value.stars < 1 || value.stars > 3 ||
          !Number.isInteger(value.attempts) || value.attempts < READINGS) { gap=true; return null; }
      return {stars:value.stars,attempts:value.attempts};
    });
    return {schema:1,best};
  }
  const completed = progress => progress.best.filter(Boolean).length;
  const unlocked = progress => Math.min(TOTAL-1,completed(progress));
  const totalStars = progress => progress.best.reduce((sum,b) => sum+(b?.stars||0),0);
  function newRun(index,progress) {
    if (!Number.isInteger(index) || index < 0 || index >= TOTAL || (progress && index > unlocked(progress))) return null;
    const run = {index,reading:0,phase:'adjust',value:0,attempts:0,misses:0,hints:0,hintShown:false,settled:false};
    prepare(run); return run;
  }
  const roundOf = run => stages[run.index].rounds[Math.min(run.reading,READINGS-1)];
  function prepare(run) {
    const round = roundOf(run);
    run.value = round.initial;
    run.phase = round.mode === 'memory' ? 'observe' : 'adjust';
    run.hintShown = false;
  }
  function setValue(run,value) {
    if (!run || run.phase !== 'adjust' || !Number.isFinite(Number(value))) return false;
    run.value = Math.round(clamp(value)); return true;
  }
  function remember(run) {
    if (run?.phase !== 'observe') return false;
    run.phase = 'adjust'; return true;
  }
  const water = run => clamp(run.value+roundOf(run).bias);
  function hint(run) {
    if (!run || run.phase !== 'adjust' || run.hints >= 2 || run.hintShown) return false;
    run.hints++; run.hintShown=true; return true;
  }
  function check(run) {
    if (!run || run.phase !== 'adjust') return null;
    const round = roundOf(run);
    run.attempts++;
    const error = Math.abs(water(run)-round.target);
    if (error > round.tolerance) { run.misses++; return {correct:false,error}; }
    run.phase='sealed'; return {correct:true,error};
  }
  function advance(run) {
    if (!run || run.phase !== 'sealed') return false;
    run.reading++;
    if (run.reading === READINGS) { run.phase='result'; return true; }
    prepare(run); return true;
  }
  const starsFor = run => run.misses === 0 && run.hints === 0 ? 3 : run.misses <= 3 && run.hints <= 1 ? 2 : 1;
  function settle(progress,run) {
    if (!run || run.phase !== 'result' || run.reading !== READINGS || run.settled || run.index > unlocked(progress)) return false;
    run.settled=true;
    const best=progress.best[run.index], stars=starsFor(run);
    progress.best[run.index]={stars:Math.max(best?.stars||0,stars),attempts:Math.min(best?.attempts||Infinity,run.attempts)};
    return true;
  }
  const api = Object.freeze({VERSION,TOTAL,READINGS,SAVE_KEY,stages,clamp,readProgress,completed,unlocked,totalStars,
    newRun,roundOf,setValue,remember,water,hint,check,advance,starsFor,settle});
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  if (root) root.TideglassRules=api;
})(typeof window === 'undefined' ? null : window);
