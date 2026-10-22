/* Deterministic flight rules. Rendering, input and persistence are separate. */
((root) => {
  'use strict';
  const W = 720, H = 1080, GRAVITY = 650, FLIGHT = .96;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function route(seed, index) {
    const anchors = seed.anchors.map(([x,y,move=0]) => ({x:clamp(150+(330-y)*1.7,130,570),y:900-(x-210)*1.05,move}));
    const count = seed.parcels.length;
    const parcelNodes = [...new Set(Array.from({length:count}, (_,i) => Math.max(1, Math.round((i+1)*(anchors.length-1)/count))))];
    return {index, anchors, parcelNodes, wind:seed.wind, gust:seed.gust||0, gustRate:seed.gustRate||1.7, ordered:!!seed.parcelSequence, checkpoint:!!seed.swingGate,
      goal:{x:clamp(anchors.at(-1).x+140,140,590),y:85}, drift:seed.lanternDrift ? seed.lanternDrift[1]*.35 : 0,
      storms:seed.spikes.map((_,i)=>{const a=anchors[Math.min(i+1,anchors.length-1)];return {x:a.x<360?650:70,y:a.y+80,r:34};})};
  }
  function anchor(cfg, i, time) {const a=cfg.anchors[i];return {x:a.x+(a.move?Math.sin(time*1.8+i)*24:0),y:a.y};}
  function goal(cfg,time) {return {x:cfg.goal.x+Math.sin(time*.9)*cfg.drift,y:cfg.goal.y+Math.sin(time*.7)*cfg.drift*.5};}
  function create(cfg) {const a=anchor(cfg,0,0);return {x:a.x-80,y:a.y+125,vx:0,vy:0,time:0,phase:'ready',node:-1,target:0,held:0,flight:0,collected:[],events:[],done:false,success:false,mastered:false,score:0,reason:'ready',trail:[]};}
  function emit(s,type,extra={}) {s.events.push({type,x:s.x,y:s.y,...extra});}
  function hook(s,cfg) {
    if(s.done||s.phase==='swing'||s.target>=cfg.anchors.length)return false;
    const a=anchor(cfg,s.target,s.time);
    if(s.phase!=='ready' && (s.flight<.38||distance(s,a)>190))return false;
    s.phase='swing';s.node=s.target;s.held=0;s.entry={x:s.x,y:s.y};s.reason='charging';emit(s,'hook');return true;
  }
  function launch(s,cfg) {
    const target=s.node+1<cfg.anchors.length?anchor(cfg,s.node+1,s.time+FLIGHT):goal(cfg,s.time+FLIGHT);
    const end={x:target.x,y:target.y+(s.node+1<cfg.anchors.length?105:0)};
    const power=s.held>=.58?1:clamp(s.held/.58,.30,1);
    return {vx:(end.x-s.x)/FLIGHT*power,vy:((end.y-s.y)/FLIGHT-GRAVITY*FLIGHT/2)*power};
  }
  function release(s,cfg) {
    if(s.done||s.phase!=='swing')return false;
    Object.assign(s,launch(s,cfg));s.phase='flight';s.target=s.node+1;s.flight=0;s.reason=s.held>=.58?'flying':'early';emit(s,'release');return true;
  }
  function finish(s,success,reason) {if(s.done)return;s.done=true;s.success=success;s.reason=reason;s.score=s.collected.length*100+(success?Math.max(100,Math.round(1000-s.time*20)):0);emit(s,success?'win':'lose');}
  function step(s,cfg,dt,input={}) {
    s.events=[];if(s.done||s.phase==='ready')return;
    s.time+=dt;
    if(s.phase==='swing') {
      const a=anchor(cfg,s.node,s.time);s.held+=dt;
      const angle=Math.sin(s.held*3.5-.6)*.58+(input.axis||0)*.12;
      const p={x:a.x+Math.sin(angle)*112,y:a.y+Math.cos(angle)*112};
      const ease=clamp(s.held/.2,0,1);s.x=s.entry.x+(p.x-s.entry.x)*ease;s.y=s.entry.y+(p.y-s.entry.y)*ease;
      if(s.held>=.58&&s.reason==='charging'){s.reason='releaseNow';s.mastered=true;emit(s,'charged');}
    } else {
      s.flight+=dt;s.vx+=((cfg.wind+Math.sin(s.time*cfg.gustRate)*cfg.gust)*.6+(input.axis||0)*160)*dt;
      s.vy+=GRAVITY*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
    }
    for(let i=0;i<cfg.parcelNodes.length;i++) {
      if(s.collected.includes(i))continue;
      if(cfg.ordered&&i!==s.collected.length)continue;
      const a=anchor(cfg,cfg.parcelNodes[i],s.time);const p={x:a.x,y:a.y+108};
      if(distance(s,p)<68){s.collected.push(i);s.score=s.collected.length*100;emit(s,'parcel',{x:p.x,y:p.y,index:i});}
    }
    if(s.phase==='flight'&&input.hold)hook(s,cfg);
    for(const storm of cfg.storms)if(distance(s,storm)<storm.r+20){finish(s,false,'storm');return;}
    if(s.target>=cfg.anchors.length&&distance(s,goal(cfg,s.time))<65) {
      if(s.collected.length===cfg.parcelNodes.length&&(!cfg.checkpoint||s.mastered))finish(s,true,'delivered');
      else {s.vy=180;s.reason='missing';}
    }
    if(s.y>H+60||s.x< -60||s.x>W+60||s.y< -100)finish(s,false,'fall');
  }
  const api={W,H,GRAVITY,FLIGHT,route,anchor,goal,create,hook,release,launch,step,distance};
  root.CloudhookFlight=Object.freeze(api);
  if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
