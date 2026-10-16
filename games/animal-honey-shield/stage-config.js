/* Content only. The shared Play UI owns the complete Stage presentation. */
window.HoneyShieldStageConfig = ({save, text}) => ({
  count:30,
  poster:'/assets/interface7-redrawn/animal-honey-shield.webp',
  stage(index) {
    const state=save(), chapter=Math.floor(index/5), chapterName=text('chapters')[chapter], rule=text('chapterRules')[chapter];
    return {
      id:index+1, kicker:text('chapter',{n:chapter+1}), title:String(index+1), subtitle:chapterName,
      status:index>=state.unlocked ? text('locked') : state.cleared[index] ? text('stars',{n:state.stars[index]||0}) : text('stage',{n:index+1}),
      summary:rule, details:[rule,text('progress',{done:Object.keys(state.cleared).length,stars:Object.values(state.stars).reduce((sum,n)=>sum+n,0)})],
      locked:index>=state.unlocked, cleared:Boolean(state.cleared[index]),
      posterPosition:`50% ${[52,65,41,57,69,47][chapter]}%`,
    };
  },
});
