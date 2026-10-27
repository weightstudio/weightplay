// Offline candidate for the first 30 cards. No DOM, storage, rewards, or Node APIs.
// Inject the existing browser engine and cards; the game has not wired this module.
const data = [
  {number:25,cells:[11,3,4,1,0,5,2,8,7,6,10,9],targets:[0,5,6],avoid:[1,4],start:{x:1,y:0,w:2,h:3},conditions:[{id:0,kind:'corner'}]},
  {number:26,cells:[11,5,3,7,9,4,8,6,2,0,1,10],targets:[3,5,8],avoid:[1,2],start:{x:0,y:1,w:3,h:2},conditions:[{id:5,kind:'upper-left'}]},
  {number:27,cells:[3,0,4,7,10,8,5,6,2,11,9,1],targets:[1,5,9],avoid:[0,2],start:{x:0,y:0,w:2,h:3},conditions:[{id:9,kind:'bottom-middle'}]},
  {number:28,cells:[10,3,7,5,6,0,1,9,11,8,2,4],targets:[0,1,3],avoid:[2,4],start:{x:1,y:1,w:3,h:2},conditions:[{id:0,kind:'middle-column'}]},
  {number:29,cells:[1,3,9,7,8,0,5,2,10,11,4,6],targets:[1,3,8],avoid:[6,7],start:{x:1,y:0,w:3,h:2},conditions:[{id:3,kind:'upper-right'}]},
  {number:30,cells:[8,0,6,11,3,5,7,4,1,10,9,2],targets:[0,5,6],avoid:[1,2],start:{x:1,y:1,w:3,h:2},conditions:[{id:0,kind:'upper-left'},{id:6,kind:'upper-right'},{id:1,kind:'visit-before-capture'}]},
];
const deepFreeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){for(const child of Object.values(value))deepFreeze(child);Object.freeze(value);}return value;};
export const NEW_CARDS=deepFreeze(data.map(card=>({...card,chapter:0,corner:null,rotate:true})));
export const QUESTIONS=deepFreeze({
  5:{kind:'shortest-first-move',choices:['up','right','down','left'],answer:'right'},
  10:{kind:'winning-frame',choices:['1x3','3x1'],answer:'1x3'},
  15:{kind:'winning-frame',choices:['2x3','3x2'],answer:'2x3'},
  20:{kind:'nest-corner',choices:['upper-left','upper-right','lower-left','lower-right'],answer:'upper-right'},
});
const directions=['up','right','down','left','rotate'];
const copyPose=p=>({...p});
function matches(card,pose,condition,visited){
  if(condition.kind==='visit-before-capture')return visited;
  const index=card.cells.indexOf(condition.id),x=index%4-pose.x,y=Math.floor(index/4)-pose.y;
  if(index<0||x<0||y<0||x>=pose.w||y>=pose.h)return false;
  switch(condition.kind){
    case 'corner':return (x===0||x===pose.w-1)&&(y===0||y===pose.h-1);
    case 'upper-left':return x===0&&y===0;
    case 'upper-right':return x===pose.w-1&&y===0;
    case 'bottom-middle':return pose.w===3&&x===1&&y===pose.h-1;
    case 'middle-column':return pose.w===3&&x===1;
    default:throw Error(`Unknown postcard condition: ${condition.kind}`);
  }
}
export function createChapter1Rules({engine,cards:legacyCards}){
  if(!engine||!Array.isArray(legacyCards)||legacyCards.length!==24)throw Error('Expected the existing engine and exactly 24 original cards');
  const cards=Object.freeze([...legacyCards,...NEW_CARDS]);
  const getCard=number=>{if(!Number.isInteger(number)||number<1||number>30)throw Error('Unknown card');return cards[number-1];};
  const initial=number=>{const card=getCard(number);return deepFreeze({number,pose:copyPose(card.start),visited:false,gate:QUESTIONS[number]?'pending':'passed',feedback:null,moves:0,errors:0,hinted:false,history:[],completed:false,stars:null});};
  function evaluate(number,pose,visited=false){
    const card=getCard(number),base=engine.evaluate(card,pose),failed=(card.conditions||[]).filter(c=>!matches(card,pose,c,visited));
    return {...base,ok:base.ok&&failed.length===0,failed};
  }
  function advance(card,pose,visited,direction){
    const next=engine.step(card,pose,direction);if(!next)return null;
    const marker=card.conditions?.find(c=>c.kind==='visit-before-capture');
    return {pose:next,visited:visited||Boolean(marker&&engine.crop(card,next).includes(marker.id))};
  }
  // Answers and capture cost zero, spatial moves cost one. A gate is modeled in
  // the search but hints never answer for the player.
  function solve(number,state=initial(number)){
    const card=getCard(number);if(state.number!==number||state.completed||!engine.legal(state.pose))return null;
    const start={pose:copyPose(state.pose),visited:state.visited,gate:state.gate};
    const key=s=>JSON.stringify([s.pose.x,s.pose.y,s.pose.w,s.pose.h,s.visited,s.gate]);
    const queue=[{state:start,path:[],distance:0}],seen=new Map();
    while(queue.length){const item=queue.shift(),s=item.state,k=key(s);if(seen.has(k)&&seen.get(k)<=item.distance)continue;seen.set(k,item.distance);
      if(s.gate==='passed'&&evaluate(number,s.pose,s.visited).ok)return {distance:item.distance,path:[...item.path,{type:'capture'}]};
      if(s.gate==='pending'&&QUESTIONS[number])queue.unshift({state:{...s,gate:'passed'},path:[...item.path,{type:'answer',choice:QUESTIONS[number].answer}],distance:item.distance});
      if(s.gate==='passed')for(const direction of directions){const next=advance(card,s.pose,s.visited,direction);if(next)queue.push({state:{...s,...next},path:[...item.path,{type:'move',direction}],distance:item.distance+1});}
    }return null;
  }
  function act(attempt,action){
    if(!attempt||!action)return null;const card=getCard(attempt.number);if(attempt.completed)return null;
    if(action.type==='reset')return initial(attempt.number);
    if(action.type==='answer'){
      const q=QUESTIONS[attempt.number];if(!q||attempt.gate!=='pending'||!q.choices.includes(action.choice))return null;
      const correct=action.choice===q.answer;return deepFreeze({...attempt,gate:correct?'passed':'pending',feedback:correct?'correct':'wrong'});
    }
    if(attempt.gate!=='passed')return null;
    if(action.type==='undo'){
      if(!attempt.history.length)return null;const previous=attempt.history.at(-1);
      return deepFreeze({...attempt,pose:copyPose(previous.pose),visited:previous.visited,history:attempt.history.slice(0,-1),moves:attempt.moves+1,feedback:null});
    }
    if(action.type==='move'){
      const next=advance(card,attempt.pose,attempt.visited,action.direction);if(!next)return null;
      return deepFreeze({...attempt,...next,moves:attempt.moves+1,feedback:null,history:[...attempt.history,{pose:copyPose(attempt.pose),visited:attempt.visited}]});
    }
    if(action.type==='capture'){
      if(!evaluate(attempt.number,attempt.pose,attempt.visited).ok)return deepFreeze({...attempt,errors:attempt.errors+1,feedback:'invalid'});
      const par=solve(attempt.number).distance,stars=engine.stars(attempt.moves,par,attempt.errors,attempt.hinted);
      return deepFreeze({...attempt,completed:true,feedback:'captured',stars});
    }
    return null;
  }
  function hint(attempt){
    if(!attempt||attempt.completed)return {status:'unavailable',attempt};
    if(attempt.gate!=='passed')return {status:'blocked',attempt};
    const result=solve(attempt.number,attempt);if(!result)return {status:'unreachable',attempt};
    const action=result.path[0];if(action.type==='capture')return {status:'ready',attempt};
    const moved=act(attempt,action);return {status:'step',action,attempt:deepFreeze({...moved,hinted:true})};
  }
  // Pure save calculation only: the caller owns persistence and shared reward
  // lifecycle. Never reduce an existing valid medal, or truncate future cards.
  function awardMedals(raw,attempt){
    if(!attempt?.completed||!Number.isInteger(attempt.stars))return null;
    const count=Math.max(60,Array.isArray(raw?.medals)?raw.medals.length:0),save=engine.sanitizeSave(raw,count);
    save.medals[attempt.number-1]=Math.max(save.medals[attempt.number-1],attempt.stars);return save;
  }
  return Object.freeze({cards,questions:QUESTIONS,initial,evaluate,solve,act,hint,awardMedals});
}
