/** Authoritative, deterministic rules. No DOM, randomness, clocks or renderer. */
export const WIDTH = 7;
export const clone = value => JSON.parse(JSON.stringify(value));
export const isColour = cell => /^[ABC]$/.test(cell || '');
export function groupAt(s, x, y) {
  const colour = s.board[y]?.[x];
  if (!isColour(colour)) return [];
  const todo = [[x,y]], seen = new Set(), group = [];
  while (todo.length) {
    const [a,b] = todo.pop(), key = `${a},${b}`;
    if (seen.has(key) || s.board[b]?.[a] !== colour) continue;
    seen.add(key); group.push([a,b]);
    todo.push([a-1,b],[a+1,b],[a,b-1],[a,b+1]);
  }
  return group;
}
export function solid(s,x,y) { return y >= s.board.length || (x >= 0 && x < WIDTH && !['.', undefined].includes(s.board[y]?.[x])); }
export function powerOf(s, e) {
  return e.power + s.enemies.filter(f => f.alive && f.buff?.targets.includes(e.id)).reduce((n,f) => n+f.buff.amount, 0);
}
export const heroPower = s => (s.hero.power + (s.hero.weapon || 0)) * (s.hero.fury ? 2 : 1);
export const damageOf = (s,e) => Math.max(1, Math.ceil(powerOf(s,e) * (e.boss ? .6 : .4)) - (s.hero.armor || 0));
export function encounter(s,e,from=s.hero.x) {
  const damage=damageOf(s,e), power=heroPower(s), enemy=powerOf(s,e);
  const code=e.shield?'shield':e.requires?.some(id=>!s.killed.includes(id))?'deputies':
    e.direction&&((e.direction==='left'&&from>=e.x)||(e.direction==='right'&&from<=e.x))?'direction':
    e.ordered&&s.seals.length!==s.sealOrder.length?'sealOrder':power<=enemy?'power':s.hero.hp<=damage?'health':null;
  return {code,damage,hero:power,enemy,target:e.id,direction:e.direction};
}
export function reachable(s, a, b) {
  if(a.y !== b.y) return false;
  for(let x=Math.min(a.x,b.x);x<=Math.max(a.x,b.x);x++) if(solid(s,x,a.y)||!solid(s,x,a.y+1)||s.board[a.y+1]?.[x]==='^')return false;
  return true;
}
export function newState(level) {
  return { level:level.id, board:level.board.map(r=>r.split('')), hero:{hp:40,maxHp:40,weapon:0,armor:0,fury:false,...level.hero}, enemies:level.enemies.map(e=>({...clone(e),alive:true})), items:level.items.map(i=>({...clone(i),alive:true})), required:level.required||[], seals:[], sealOrder:level.sealOrder||[], collected:[], killed:[], moves:0, status:'playing', reason:null };
}
function snapshot(s) {return clone(s);}
export function step(input,x,y,{trace=true}={}) {
  const s=clone(input), events=[];
  const emit=(type,data={})=>{if(trace)events.push({type,...data,state:snapshot(s)});};
  const fail=(reason,data={})=>{s.status='lost';s.reason={code:reason,...data};emit('fail',s.reason);};
  const group=groupAt(s,x,y);
  if(s.status!=='playing'||!group.length)return {state:s,events,valid:false};
  group.forEach(([a,b])=>s.board[b][a]='.');s.moves++;emit('clear',{group});
  // Each pass either moves an entity, consumes one, kills one or changes phase.
  // Board height and inventory bound the stabilization; no real-time physics.
  for(let iteration=0;iteration<256 && s.status==='playing';iteration++) {
    let fell=false,fallFailure=null;
    for(const a of [s.hero,...s.enemies.filter(e=>e.alive),...s.items.filter(i=>i.alive)]) {
      const old=a.y;
      while(a.y<s.board.length-1&&!solid(s,a.x,a.y+1))a.y++;
      if(a.y!==old)fell=true;
      if(s.board[a.y+1]?.[a.x]==='^') {
        if(a===s.hero){fallFailure='spikes';break;}
        a.alive=false;
        if(s.items.includes(a)||s.required.includes(a.id)||a.boss){fallFailure='objectiveLost';break;}
      }
    }
    if(fell)emit('fall');
    if(fallFailure){fail(fallFailure);break;}
    if(s.status!=='playing')break;
    const enemies=s.enemies.filter(e=>e.alive&&reachable(s,s.hero,e)).sort((a,b)=>Math.abs(a.x-s.hero.x)-Math.abs(b.x-s.hero.x)||a.x-b.x||a.id.localeCompare(b.id));
    // A pickup directly under Fia is collected before approaching other enemies,
    // but never before an enemy occupying the same cell.
    const item=s.items.filter(i=>i.alive&&reachable(s,s.hero,i)&&(!enemies.length||(i.x===s.hero.x&&!enemies.some(e=>e.x===i.x)))).sort((a,b)=>Math.abs(a.x-s.hero.x)-Math.abs(b.x-s.hero.x)||a.x-b.x)[0];
    if(item) {
      s.hero.x=item.x;emit('walk',{target:item.id});
      if(item.kind==='crown') {
        if(s.required.some(id=>!s.killed.includes(id))||s.enemies.some(e=>e.alive&&e.boss)||s.sealOrder.some((v,i)=>s.seals[i]!==v)) {fail('requirements');break;}
        item.alive=false;s.status='won';emit('win');break;
      }
      item.alive=false;s.collected.push(item.id);
      const hpBefore=s.hero.hp;
      if(item.kind==='sword')s.hero.weapon=Math.max(s.hero.weapon,item.amount||12);
      if(item.kind==='armor')s.hero.armor=Math.max(s.hero.armor,item.amount||8);
      if(item.kind==='heart'){s.hero.hp+=item.amount||60;s.hero.maxHp+=item.amount||60;}
      if(item.kind==='elixir'){s.hero.hp*=2;s.hero.maxHp=Math.max(s.hero.maxHp,s.hero.hp);}
      if(item.kind==='fury')s.hero.fury=true;
      if(item.kind==='key')for(const row of s.board)for(let i=0;i<row.length;i++)if(row[i]===item.link)row[i]='.';
      if(item.kind==='rune')s.enemies.filter(e=>e.shield===item.link).forEach(e=>e.shield=null);
      if(item.kind==='seal') {
        if(s.sealOrder[s.seals.length]!==item.link){fail('sealOrder');break;}
        s.seals.push(item.link);
      }
      emit('pickup',{kind:item.kind,id:item.id,gain:s.hero.hp-hpBefore,amount:item.amount});continue;
    }
    if(enemies.length) {
      const enemy=enemies[0], from=s.hero.x, enemyPower=powerOf(s,enemy);
      // Record approach to adjacent contact before applying the result.
      const outcome=encounter(s,enemy,from);
      emit('approach',{target:enemy.id,from,to:enemy.x,...outcome});
      if(outcome.code){if(['power','health'].includes(outcome.code))s.hero.hp=0;fail(outcome.code,outcome);break;}
      s.hero.hp-=outcome.damage;s.hero.power+=enemyPower;s.hero.fury=false;
      if(enemy.next) {
        // Defeat and relocation are separate events: neither model teleports.
        const next=enemy.next;delete enemy.next;
        emit('hit',{target:enemy.id,power:enemyPower,damage:outcome.damage,boss:true,phase:true});
        s.hero.x=enemy.x;emit('walk',{target:enemy.id});
        Object.assign(enemy,next);
        if(enemy.open)for(const row of s.board)for(let i=0;i<row.length;i++)if(row[i]===enemy.open)row[i]='.';
        emit('phase',{target:enemy.id,power:enemyPower});
      } else {enemy.alive=false;s.killed.push(enemy.id);emit('hit',{target:enemy.id,power:enemyPower,damage:outcome.damage,boss:!!enemy.boss});s.hero.x=enemy.x;emit('walk',{target:enemy.id});}
      continue;
    }
    break;
  }
  return {state:s,events,valid:true};
}
export function actions(s) {
  const seen=new Set(), result=[];
  for(let y=0;y<s.board.length;y++)for(let x=0;x<WIDTH;x++)if(isColour(s.board[y][x])&&!seen.has(`${x},${y}`)) {
    const g=groupAt(s,x,y);g.forEach(([a,b])=>seen.add(`${a},${b}`));result.push([x,y]);
  }
  return result;
}
export function stateKey(s) {const v=clone(s);delete v.moves;delete v.reason;return JSON.stringify(v);}
export function solve(start,{limit=60000}={}) {
  if(start.status==='won')return {status:'solved',moves:[],visited:0};
  if(start.status!=='playing')return {status:'dead',moves:[],visited:0};
  const queue=[{s:start,path:[]}],seen=new Set([stateKey(start)]);
  for(let i=0;i<queue.length;i++) {
    if(i>=limit)return {status:'budget',moves:[],visited:i};
    const {s,path}=queue[i];
    for(const a of actions(s)) {
      const next=step(s,...a,{trace:false}).state,moves=[...path,a];
      if(next.status==='won')return {status:'solved',moves,visited:i+1};
      if(next.status!=='playing')continue;
      const key=stateKey(next);if(!seen.has(key)){seen.add(key);queue.push({s:next,path:moves});}
    }
  }
  return {status:'dead',moves:[],visited:queue.length};
}
