((root)=>{
  "use strict";
  const layouts=[
    [[.50,.42,0],[.70,.42,0],[.50,.30,0],[.32,.48,45],[.68,.48,315],[.42,.60,0],[.58,.60,0]],
    [[.42,.40,45],[.58,.40,315],[.50,.28,0],[.31,.52,90],[.69,.52,270],[.43,.61,0],[.57,.61,0]],
    [[.40,.42,0],[.60,.42,0],[.50,.30,90],[.29,.53,45],[.71,.53,315],[.42,.63,0],[.58,.63,0]],
    [[.50,.39,0],[.70,.50,90],[.50,.28,0],[.30,.50,315],[.70,.30,45],[.42,.60,0],[.58,.60,0]],
    [[.45,.40,315],[.55,.40,45],[.50,.28,0],[.30,.50,0],[.70,.50,180],[.43,.62,0],[.57,.62,0]],
    [[.38,.43,45],[.62,.43,315],[.50,.29,0],[.28,.53,90],[.72,.53,270],[.42,.64,0],[.58,.64,0]]
  ];
  const pieces=["large-a","large-b","medium","small-a","small-b","square","parallelogram"];
  function build(index){const base=layouts[index%layouts.length],angle=(index%4)*90,mirror=index%2===1,offset=((index%5)-2)*.012;const targets=base.map(([x,y,r])=>{let dx=x-.5,dy=y-.5;if(mirror)dx=-dx;const rad=angle*Math.PI/180,nx=.5+dx*Math.cos(rad)-dy*Math.sin(rad),ny=.5+dx*Math.sin(rad)+dy*Math.cos(rad);return{x:Math.max(.12,Math.min(.88,nx+offset)),y:Math.max(.13,Math.min(.75,ny+offset/2)),r:(mirror?-r:r+angle+360)%360}});return{index,targets,names:["turtle","cat","bird","fox","fish","rabbit"][index%6]}}
  root.TANGRAM_LEVELS={pieces,levels:Array.from({length:30},(_,i)=>build(i)),build};if(typeof module!=="undefined")module.exports=root.TANGRAM_LEVELS;
})(typeof window!=="undefined"?window:globalThis);
