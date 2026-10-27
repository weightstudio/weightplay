// Unreviewed local-practice art and grouping. Never a formal campaign entry.
(() => {
  const points=[[128,286],[284,316],[172,648],[367,661],[583,674],[488,1040],[633,562],[315,265],[555,323],[288,403],[237,427],[476,533],[376,524],[224,527],[551,540],[417,560],[384,799],[277,855],[491,855],[384,885],[304,943],[464,943]];
  window.AnimalColoringStudioV25Practice=Object.freeze({
    ready:false,id:'garden-bee-v25-practice',
    art:'/Assets/animal-coloring-studio-expansion-drafts/13-garden-bee-block-v25-source.png',
    mask:'/docs/game-build-handoffs/animal-coloring-studio-v25-pilot/UNREVIEWED-grouped-mask.png',
    anchors:Object.freeze(points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})))
  });
})();
