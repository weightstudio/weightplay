export const W = 360, H = 600, PADDLE_Y = 560, BALL_R = 5.6;
export const SAVE_KEY = 'weightplay_breakout_crystal_v23';
export const LEGACY_KEY = 'weightplay_breakout_campaign_v18';
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const layouts = [
  ['..111..','.11111.','..111..'],
  ['111.111','.11.11.','..1.1..'],
  ['1.111.1','.1.1.1.','11...11'],
  ['11...11','.11111.','..111..'],
  ['.11111.','11...11','.11111.'],
  ['..aaa..','.11111.','1.....1'],
  ['a1...1a','.1a1a1.','..111..'],
  ['a.a.a.a','111.111','.11.11.'],
  ['.a111a.','11.a.11','1.....1'],
  ['aa...aa','.11111.','..aaa..'],
  ['11b1b11','.11111.'],
  ['a1b.b1a','11...11','.1b1b1.'],
  ['b1a.a1b','.11111.','a..b..a'],
  ['a1b1b1a','1.111.1','.b...b.'],
  ['aab1baa','.11111.','b1...1b'],
  ['aaapaaa','.11111.'],
  ['a1a.a1a','1p1.1p1','.a...a.'],
  ['apabapa','11...11','.11p11.'],
  ['aapbpaa','1a...a1','.11p11.'],
  ['aapapaa','.b1a1b.','a1...1a'],
  ['1a1p1a1','.11111.'],
  ['a1b.b1a','.1p1p1.','11...11'],
  ['aap1paa','b1...1b','.1a1a1.'],
  ['ap11bpa','.a1.1a.','b1...1b'],
  ['aapbpaa','1a...a1','.1b1b1.'],
  ['abp1pba','.a1a1a.','b1...1b'],
  ['a1bpb1a','1a...a1','.p1a1p.'],
  ['pa1b1ap','.aa.aa.','b11p11b'],
  ['abpapba','1a1.1a1','.bp1pb.'],
  ['aapbpaa','ab1p1ba','1a...a1','.1b1b1.'],
];
export const LEVELS = Object.freeze(layouts.map((rows, i) => Object.freeze({
  id: i + 1, arc: Math.floor(i / 5), rows, checkpoint: (i + 1) % 5 === 0,
  speed: 270 + Math.floor(i / 5) * 8 + (i % 5) * 3,
  gate: i >= 20, coreHp: 3 + Math.floor(i / 10),
})));
export function levelBricks(level) {
  return level.rows.flatMap((row, r) => [...row].flatMap((kind, c) => kind === '.' ? [] : [{
    id: r * 7 + c, col: c, row: r, x: 18 + c * 47, y: 66 + r * 27,
    w: 42, h: 19, kind, hp: kind === 'a' ? 2 : 1, maxHp: kind === 'a' ? 2 : 1,
  }]));
}
export function normalizeSave(raw = {}, legacy = {}) {
  const ids = value => [...new Set((Array.isArray(value) ? value : []).map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 30))].sort((a,b) => a-b);
  const cleared = ids([...ids(raw?.cleared), ...ids(legacy?.cleared)]);
  const num = (v,d=0) => Number.isFinite(Number(v)) ? Number(v) : d;
  const highestUnlocked = clamp(Math.max(1, Math.floor(num(raw?.highestUnlocked,1)), Math.floor(num(legacy?.highestUnlocked,1)), ...cleared.map(n=>n+1)),1,30);
  const stars = {}, best = {};
  for (const n of cleared) {
    stars[n] = clamp(Math.floor(num(raw?.stars?.[n],1)),1,3);
    best[n] = Math.max(0, Math.floor(num(raw?.best?.[n])));
  }
  return {schema:23,highestUnlocked,cleared,stars,best,
    paddle: raw?.paddle === 'comet' && cleared.length >= 3 ? 'comet' : 'guardian',
    aurora: raw?.aurora === true, finish: raw?.finish === 'aurora' && raw?.aurora === true ? 'aurora' : 'jade'};
}
export function clearSave(save, state) {
  if (state.status !== 'won') throw Error('A win is required to save a clear');
  const n = state.level.id, stars = state.lives >= 3 ? 3 : state.lives === 2 ? 2 : 1;
  return normalizeSave({...save,cleared:[...save.cleared,n],highestUnlocked:Math.max(save.highestUnlocked,n+1),
    stars:{...save.stars,[n]:Math.max(stars,save.stars[n]||0)},best:{...save.best,[n]:Math.max(state.score,save.best[n]||0)}});
}
export function createRun(stage=1, paddle='guardian') {
  const level = LEVELS[clamp(Math.floor(stage),1,30)-1];
  return {level,width:W,height:H,paddleY:PADDLE_Y,status:'ready',bricks:levelBricks(level),paddle:180,paddleTarget:180,paddleKind:paddle,
    paddleWidth:paddle==='comet'?72:94,ball:{x:180,y:PADDLE_Y-13,vx:0,vy:0},
    lives:3,score:0,combo:0,maxCombo:0,energy:0,pierce:0,elapsed:0,serveCount:0,
    contacts:0,core:null,gateX:180,gatePhase:0,events:[],hitStop:0,trail:[],lastBrickAt:0};
}
function emit(s,type,details={}) { s.events.push({type,...details}); }
export function resizeRun(s,width,height) {
  const sx=width/s.width,sy=height/s.height;
  s.ball.x*=sx;s.ball.y*=sy;s.paddle*=sx;s.paddleTarget*=sx;
  s.width=width;s.height=height;s.paddleY=height-40;
  s.paddleWidth=(s.paddleKind==='comet'?72:94)*Math.min(1.55,width/W);
  for(const b of s.bricks){const base=levelBricks(s.level).find(n=>n.id===b.id);b.x=base.x*width/W;b.w=base.w*width/W;b.y=height<450?38+base.row*23:base.y;b.h=height<450?17:19;}
  if(s.core)s.core.x*=sx;
  s.gateX=width/2;
}
export function aim(s,x) { s.paddleTarget=clamp(x,s.paddleWidth/2+8,s.width-s.paddleWidth/2-8); }
export function serve(s) {
  if(s.status!=='ready')return false;
  s.status='playing';s.serveCount++;s.ball={x:s.paddle,y:s.paddleY-13,vx:(s.serveCount%2?1:-1)*s.level.speed*.3,vy:-s.level.speed*Math.sqrt(.91)};
  emit(s,'serve',{x:s.ball.x,y:s.ball.y});return true;
}
export function pulse(s) {
  if(s.status!=='playing'||s.energy<100)return false;
  s.energy=0;s.pierce=3;emit(s,'pulse',{x:s.ball.x,y:s.ball.y});return true;
}
function hurtBrick(s,b,damage=1,chain=new Set()) {
  if(b.hp<=0||chain.has(b.id))return;chain.add(b.id);
  b.hp=Math.max(0,b.hp-damage);s.contacts++;s.combo++;s.maxCombo=Math.max(s.maxCombo,s.combo);
  const destroyed=b.hp===0;
  s.score+=destroyed?Math.round(50*(1+Math.min(3,Math.floor(s.combo/3))*.25)):15;
  s.energy=clamp(s.energy+(s.paddleKind==='comet'?25:20),0,100);
  s.lastBrickAt=s.elapsed;
  emit(s,destroyed?'break':'armour',{x:b.x+b.w/2,y:b.y+b.h/2,id:b.id,kind:b.kind,combo:s.combo});
  if(!destroyed)return;
  if(b.kind==='p'){s.energy=100;emit(s,'charge',{x:b.x+b.w/2,y:b.y+b.h/2});}
  if(b.kind==='b') {
    emit(s,'blast',{x:b.x+b.w/2,y:b.y+b.h/2});s.hitStop=.035;
    for(const other of s.bricks)if(Math.abs(other.col-b.col)+Math.abs(other.row-b.row)<=1)hurtBrick(s,other,2,chain);
  }
}
function checkClear(s) {
  if(s.bricks.some(b=>b.hp>0))return;
  if(s.level.checkpoint&&!s.core){
    s.core={x:s.width/2,y:102,w:62,h:36,hp:s.level.coreHp,maxHp:s.level.coreHp,phase:0};
    s.energy=100;emit(s,'core-open',{x:180,y:102});return;
  }
  if(s.core?.hp>0)return;
  s.status='won';s.score+=s.lives*150;emit(s,'win',{x:s.ball.x,y:s.ball.y});
}
// Swept circle against expanded AABB. Return the first entry, including its normal.
export function sweep(x,y,dx,dy,r,box) {
  const minX=box.x-r,maxX=box.x+box.w+r,minY=box.y-r,maxY=box.y+box.h+r;
  let near=-Infinity,far=Infinity,nx=0,ny=0;
  for(const [p,d,min,max,ax,ay] of [[x,dx,minX,maxX,1,0],[y,dy,minY,maxY,0,1]]){
    if(Math.abs(d)<1e-8){if(p<min||p>max)return null;continue;}
    const a=(min-p)/d,b=(max-p)/d,entry=Math.min(a,b),end=Math.max(a,b);
    if(entry>near){near=entry;nx=d>0?-ax:ax;ny=d>0?-ay:ay;}
    far=Math.min(far,end);if(near>far)return null;
  }
  if(near<-.0001||near>1||far<0)return null;
  return {t:Math.max(0,near),nx,ny};
}
export function step(s,dt) {
  if(s.status!=='playing'&&s.status!=='ready')return;
  dt=clamp(dt,0,1/60);
  const delta=s.paddleTarget-s.paddle;s.paddle+=clamp(delta,-640*dt,640*dt);
  if(s.status==='ready'){s.ball.x=s.paddle;s.ball.y=s.paddleY-13;return;}
  if(s.hitStop>0){s.hitStop=Math.max(0,s.hitStop-dt);return;}
  s.elapsed+=dt;s.gatePhase=s.elapsed%5;
  s.gateX=s.width/2+Math.sin(s.elapsed*.9)*s.width*.255;
  if(s.core){s.core.x=s.width/2+Math.sin(s.elapsed*(.65+s.level.arc*.06))*s.width*.25;s.core.phase=s.elapsed%3;}
  let remaining=dt;
  for(let pass=0;pass<5&&remaining>1e-6&&s.status==='playing';pass++){
    const ball=s.ball,dx=ball.vx*remaining,dy=ball.vy*remaining;
    let best=null;
    const test=(box,type,object=null)=>{const h=sweep(ball.x,ball.y,dx,dy,BALL_R,box);if(h&&(!best||h.t<best.t))best={...h,type,object};};
    test({x:-30,y:-50,w:38,h:s.height+100},'wall');test({x:s.width-8,y:-50,w:38,h:s.height+100},'wall');
    test({x:0,y:-30,w:s.width,h:42},'wall');
    if(ball.vy>0)test({x:s.paddle-s.paddleWidth/2,y:s.paddleY,w:s.paddleWidth,h:12},'paddle');
    for(const b of s.bricks)if(b.hp>0)test(b,'brick',b);
    if(s.level.gate)test({x:s.gateX-32,y:s.height*.43,w:64,h:8},'gate');
    if(s.core?.hp>0)test({x:s.core.x-31,y:s.core.y-18,w:62,h:36},'core',s.core);
    if(!best){ball.x+=dx;ball.y+=dy;remaining=0;break;}
    ball.x+=dx*best.t;ball.y+=dy*best.t;remaining*=1-best.t;
    const contact={x:ball.x,y:ball.y};
    if(best.type==='paddle'){
      const off=clamp((ball.x-s.paddle)/(s.paddleWidth/2),-1,1);
      const angle=off*1.04, speed=s.level.speed+Math.min(24,s.contacts*.55);
      ball.vx=Math.sin(angle)*speed;
      if(Math.abs(ball.vx)<speed*.12)ball.vx=(off>=0?1:-1)*speed*.12;
      ball.vy=-Math.sqrt(speed*speed-ball.vx*ball.vx);ball.y=s.paddleY-BALL_R-.1;
      s.combo=0;emit(s,'bounce',contact);
    } else {
      let through=false;
      if(best.type==='brick'){
        through=s.pierce>0;if(through)s.pierce--;
        hurtBrick(s,best.object,through?3:1);checkClear(s);
      }else if(best.type==='core'){
        best.object.hp=Math.max(0,best.object.hp-(s.pierce>0?2:1));s.pierce=Math.max(0,s.pierce-1);
        s.score+=100;s.energy=clamp(s.energy+25,0,100);s.hitStop=.04;
        emit(s,'core-hit',{...contact,hp:best.object.hp});checkClear(s);
      }else emit(s,best.type,contact);
      if(!through){if(best.nx)ball.vx=-ball.vx;if(best.ny)ball.vy=-ball.vy;}
      if(through){ball.x+=Math.sign(ball.vx)*.15;ball.y+=Math.sign(ball.vy)*.15;}
      else {ball.x+=best.nx*.15;ball.y+=best.ny*.15;}
    }
  }
  if(s.ball.y>s.height+10&&s.status==='playing'){
    s.lives--;s.combo=0;s.pierce=0;emit(s,'miss',{x:s.ball.x,y:s.height-12});
    s.status=s.lives>0?'ready':'lost';
    if(s.status==='ready'){s.ball={x:s.paddle,y:s.paddleY-13,vx:0,vy:0};}
    else emit(s,'lose');
  }
}
export function drainEvents(s){const events=s.events;s.events=[];return events;}
