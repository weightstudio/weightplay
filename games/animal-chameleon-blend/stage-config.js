/* Game records only. Shared Play UI owns all card geometry and input. */
(() => {
  'use strict';
  window.ChameleonStageConfig=Object.freeze({
    nextLabel(locale) { return {it:'Avanti',ru:'Далее'}[locale] || ''; },
    create({profiles,getBest,gameText,t,common,practiceRequested=false,practice=()=>false,practiceTitle=()=>''}) {
      return {gameId:'animal-chameleon-blend',count:practiceRequested?60:profiles.length,
        poster:'/assets/interface7-redrawn/animal-chameleon-blend.webp',
        background:'/assets/lobby-block-atmosphere.svg',
        stage(index) {
          const stage=index+1,profile=profiles[index],best=getBest();
          if(!profile)return {id:stage,kicker:common(9)+' '+stage,title:common(9)+' '+stage,status:'🔒',locked:true,cleared:false};
          const names=gameText().stageNames||[],arcs=gameText().arcNames||[];
          const local=practice();
          return {id:stage,kicker:[local&&stage>=31?practiceTitle():arcs[Math.floor(index/5)],common(9)+' '+stage].filter(Boolean).join(' · '),
            title:local&&stage>=31?practiceTitle():(names[index]||common(9)+' '+stage),subtitle:t(13)+' '+profile.need+'/'+profile.rounds,
            status:local?(stage<31?'🔒':practiceTitle()):stage>Math.min(profiles.length,best+1)?'🔒':stage<=best?common(8)+' '+stage:t(17),
            locked:local?stage<31:stage>Math.min(profiles.length,best+1),cleared:local?false:stage<=best,
            summary:t(0)+' · '+t(16),details:[t(12)+' '+profile.need+'/'+profile.rounds,
              profile.sequence+' '+t(19)+' · '+(profile.reverse?t(14):t(15)),
              profile.preview.toFixed(1)+'s / '+profile.choose.toFixed(1)+'s']};
        }};
    },
  });
})();
