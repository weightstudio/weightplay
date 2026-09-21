/* Original horizontal push battle. Simulation uses 100 ms ticks and X=0..100.
 * Rendering, input, storage and audio are deliberately outside this module. */
(() => {
  'use strict';
  const troops = {
    blade: { cost:3, hp:62, damage:8, reach:8, speed:.46, period:14, cooldown:24 },
    spear: { cost:4, hp:44, damage:12, reach:11, speed:.43, period:16, cooldown:30 },
    bow:   { cost:5, hp:26, damage:9, reach:30, speed:.38, period:20, cooldown:45 },
    horse: { cost:7, hp:72, damage:19, reach:8, speed:.78, period:18, cooldown:65 }
  };
  const has = (b,id) => b.talents.includes(id);
  function actor(b,type,enemy=false,bossKind=null) {
    const chapter=b.level.chapter-1;
    const normal={soldier:[34,6,8,.37,20],shield:[66,5,8,.27,23],raider:[32,10,8,.66,20],flanker:[30,7,24,.39,22],medic:[35,3,20,.30,26],bomber:[30,13,17,.31,42],drummer:[48,3,9,.29,28],arbalest:[38,12,32,.23,36]};
    const boss=Boolean(bossKind), row=normal[type]||normal.soldier, spec=troops[type];
    const card=enemy?null:b.army[type];
    const hp=enemy?Math.round((boss?155:row[0])*(1+chapter*.08)):Math.round(spec.hp*(has(b,'guard2')?1.25:1)*(card?.hp||1));
    return {id:b.nextActorId++,type,kind:type,boss,bossKind,enemy,x:enemy?93:7,previousX:enemy?93:7,
      hp,maxHp:hp,damage:enemy?(boss?13:row[1])*(1+chapter*.04):Math.round(spec.damage*(card?.damage||1)),
      reach:enemy?(boss?10:row[2]):spec.reach,speed:enemy?(boss?.28:row[3]):spec.speed,
      period:enemy?(boss?24:row[4]):spec.period,attackCooldown:0,attackFlash:0,hitFlash:0,stun:0,
      age:0,windup:null,defeatedTicks:0,moving:false,shield:type==='shield'||bossKind==='bulwark',charged:false,level:card?.stars||1,general:false,
      trait:card?.trait||'',rarity:card?.rarity||0,cardId:card?.id||null,slow:0,inspired:false};
  }
  function create(level,talents=[],army={}) {
    const base=120+(talents.includes('guard1')?40:0), command=150+(level.chapter-1)*24;
    const b={level,talents:[...talents],army:JSON.parse(JSON.stringify(army)),units:[],enemies:[],ticks:0,buns:12+(talents.includes('supply1')?3:0),
      adouHp:base,maxAdouHp:base,commandHp:command,maxCommandHp:command,wave:1,spawned:0,
      nextSpawn:35,nextActorId:1,nextEffectId:1,recruitIndex:0,deployCooldown:{},skillsUsed:{horse:0},
      chargeTicks:0,campFlash:0,effects:[],events:[],result:null,rescued:false,bossSpawned:false,status:''};
    b.units.push(actor(b,'blade'));return b;
  }
  function cost(b,type){return has(b,'supply3')&&(b.recruitIndex+1)%4===0?0:troops[type]?.cost;}
  function deploy(b,type) {
    if(!troops[type]||b.result||b.deployCooldown[type]>0||b.buns<cost(b,type)||b.units.filter(u=>u.hp>0).length>=12)return false;
    b.buns-=cost(b,type);b.recruitIndex++;b.deployCooldown[type]=troops[type].cooldown;
    b.units.push(actor(b,type));b.events.push('deploy');return true;
  }
  function effect(b,kind,x,text='',fromX=x,visual={}) {
    b.effects.push({id:b.nextEffectId++,kind,x,fromX,text,ttl:kind==='defeat'?8:6,...visual});
    if(b.effects.length>32)b.effects.shift();
  }
  function damage(b,target,amount,type) {
    if(!target||target.hp<=0)return;
    const blocked=(target.shield&&type!=='blade'&&type!=='charge')||(target.trait==='shield'&&['bow','flanker','arbalest','medic','bomber'].includes(type));
    const applied=Math.min(target.hp,Math.max(1,Math.round(amount*(blocked?.4:1))));
    target.hp-=applied;target.hitFlash=3;
    effect(b,blocked?'block':'hit',target.x,'−'+applied,target.x,{targetId:target.id,strong:applied>=18,enemy:target.enemy});b.events.push(blocked?'block':'hit');
    if(target.hp<=0){target.defeatedTicks=5;target.windup=null;effect(b,'defeat',target.x,'',target.x,{targetId:target.id,enemy:target.enemy});b.events.push('defeat');if(target.enemy)b.buns=Math.min(30,b.buns+(target.boss?5:1));}
    return applied;
  }
  function charge(b) {
    if(b.result||b.skillsUsed.horse>0||!b.enemies.some(e=>e.hp>0))return false;
    for(const enemy of b.enemies.filter(e=>e.hp>0)){
      damage(b,enemy,has(b,'charge2')?36:24,'charge');enemy.x=Math.min(93,enemy.x+12);enemy.stun=10;
      enemy.windup=null;enemy.attackCooldown=Math.max(enemy.attackCooldown,10);
    }
    b.skillsUsed.horse=has(b,'charge1')?70:100;b.chargeTicks=12;b.events.push('charge');effect(b,'charge',85,'',8);
    if(has(b,'charge3'))for(const u of b.units)u.attackCooldown=0;
    return true;
  }
  function spawn(b,type,boss=null) {if(b.enemies.filter(e=>e.hp>0).length<18)b.enemies.push(actor(b,type,true,boss));}
  function step(b) {
    if(b.result)return b.result;
    b.ticks++;b.events=[];
    b.effects=b.effects.filter(f=>--f.ttl>0);
    for(const key of Object.keys(b.deployCooldown))b.deployCooldown[key]=Math.max(0,b.deployCooldown[key]-1);
    b.skillsUsed.horse=Math.max(0,b.skillsUsed.horse-1);b.chargeTicks=Math.max(0,b.chargeTicks-1);b.campFlash=Math.max(0,b.campFlash-1);
    if(b.ticks%(has(b,'supply2')?11:14)===0)b.buns=Math.min(30,b.buns+1);
    const count=9+(b.level.chapter-1)*2, gap=b.level.rule==='reserve'?36:b.level.rule==='rally'?22:29;
    if(b.ticks>=b.nextSpawn&&b.spawned<count){
      spawn(b,b.level.roster[b.spawned%b.level.roster.length]);b.spawned++;b.nextSpawn=b.ticks+gap;
      const nextWave=Math.min(3,1+Math.floor(b.spawned/(count/3)));
      if(nextWave>b.wave){b.wave=nextWave;b.nextSpawn+=35;b.buns=Math.min(30,b.buns+3);b.events.push('wave');}
    }
    if(b.level.bossKind&&!b.bossSpawned&&(b.spawned>=count||b.commandHp<b.maxCommandHp*.6)){
      spawn(b,'boss',b.level.bossKind);b.bossSpawned=true;b.events.push('boss');
    }
    const all=[...b.units,...b.enemies];
    for(const a of all){a.previousX=a.x;a.moving=false;if(a.hitFlash>0)a.hitFlash--;if(a.attackFlash>0)a.attackFlash--;if(a.defeatedTicks>0)a.defeatedTicks--;if(a.slow>0)a.slow--;}
    for(const a of all){
      if(a.hp<=0)continue;a.age++;
      if(a.stun>0){a.stun--;continue;}
      const friends=a.enemy?b.enemies:b.units, foes=a.enemy?b.units:b.enemies, direction=a.enemy?-1:1;
      a.inspired=friends.some(f=>f.kind==='drummer'&&f.hp>0&&f.stun===0&&Math.abs(f.x-a.x)<24);
      if(a.kind==='drummer'&&a.age%30===0)effect(b,'rally',a.x,'',a.x,{sourceId:a.id,enemy:true});
      if(a.bossKind==='bulwark')a.shield=a.age%65<40;
      if((a.kind==='medic'||a.bossKind==='healer')&&a.age%45===0){
        for(const target of friends.filter(f=>f.hp>0&&Math.abs(f.x-a.x)<24)){const heal=Math.min(6,target.maxHp-target.hp);target.hp+=heal;if(heal)effect(b,'heal',target.x,'+'+heal);}
      }
      if((a.bossKind==='summoner'||a.bossKind==='warlord')&&a.age%95===0)spawn(b,'soldier');
      if(a.windup){
        if(--a.windup.ticks<=0){const hit=a.windup;a.windup=null;
          if(hit.target==='base'&&Math.abs((a.enemy?4:96)-a.x)<=a.reach+1){
            if(a.enemy){b.adouHp=Math.max(0,b.adouHp-a.damage);b.campFlash=5;b.events.push('hurt');effect(b,'hit',4,'−'+Math.round(a.damage));}
            else {b.commandHp=Math.max(0,b.commandHp-a.damage);effect(b,'hit',96,'−'+a.damage);}
          } else {
            const target=foes.find(f=>f.id===hit.target&&f.hp>0);
            if(target&&Math.abs(target.x-a.x)<=a.reach+5){
              const cavalry=target.kind==='raider'||target.bossKind==='charger';
              const amount=a.damage*(!a.enemy&&a.type==='spear'&&cavalry?1.8:1)*(!a.enemy&&a.type==='horse'&&!a.charged?1.6:1);
              const applied=damage(b,target,amount,a.type)||0;
              if(a.trait==='drain'){const heal=Math.min(a.maxHp-a.hp,Math.ceil(applied*.25));a.hp+=heal;if(heal)effect(b,'heal',a.x,'+'+heal);}
              if(a.trait==='slow')target.slow=30;
              if(a.trait==='push'){target.x=Math.min(93,target.x+4);target.stun=Math.max(target.stun,3);target.windup=null;}
              if(a.kind==='bomber'||a.trait==='blast'||a.trait==='cleave'||(a.trait==='burst'&&!a.charged)){
                for(const extra of foes.filter(f=>f.id!==target.id&&f.hp>0&&Math.abs(f.x-target.x)<9))damage(b,extra,amount*.6,a.type);
                effect(b,'blast',target.x,'',a.x,{strong:true,enemy:a.enemy});
              }
              if(a.kind==='arbalest'||a.trait==='pierce'){
                const extra=foes.filter(f=>f.id!==target.id&&f.hp>0&&(f.x-target.x)*direction>=0&&Math.abs(f.x-target.x)<16).sort((l,r)=>Math.abs(l.x-target.x)-Math.abs(r.x-target.x))[0];
                if(extra)damage(b,extra,amount*.7,a.type);
              }
              a.charged=true;
              if(!a.enemy&&a.type==='spear')target.stun=Math.max(target.stun,2);
              if(a.bossKind==='charger'||a.bossKind==='warlord'){target.x=Math.max(7,target.x-5);target.stun=3;}
            }
          }
        }continue;
      }
      if(a.attackCooldown>0)a.attackCooldown=Math.max(0,a.attackCooldown-(a.inspired?1.4:1));
      const reachable=foes.filter(f=>f.hp>0&&Math.abs(f.x-a.x)<=a.reach);
      reachable.sort((l,r)=>(!a.enemy&&a.type==='bow'?(Number(['medic','drummer','bomber'].includes(r.kind))-Number(['medic','drummer','bomber'].includes(l.kind))):0)||Math.abs(l.x-a.x)-Math.abs(r.x-a.x));
      const target=reachable[0],baseX=a.enemy?4:96,atBase=Math.abs(baseX-a.x)<=a.reach;
      if(target||atBase){
        if(a.attackCooldown===0){const windup=a.kind==='bomber'?10:a.kind==='arbalest'?6:3;a.attackCooldown=a.period;a.attackFlash=windup+2;a.windup={target:target?target.id:'base',ticks:windup,total:windup};effect(b,a.kind==='bomber'?'bomb':a.type==='bow'||['flanker','arbalest'].includes(a.kind)?'arrow':'attack',target?target.x:baseX,'',a.x,{sourceId:a.id,targetId:target?.id,enemy:a.enemy,ttl:windup+3,flight:windup});}
      }else{
        let speed=a.speed*(a.slow>0?.55:1);
        if(b.level.rule==='mud'&&a.x>35&&a.x<65)speed*=.6;
        if(a.bossKind==='weaver'&&a.age%60<18)speed*=2;
        const front=foes.filter(f=>f.hp>0&&(f.x-a.x)*direction>=0).sort((l,r)=>Math.abs(l.x-a.x)-Math.abs(r.x-a.x))[0];
        // Never cross an opposing foot anchor, even during fast movement.
        const travel=Math.min(speed,front?Math.max(0,Math.abs(front.x-a.x)-3):speed);
        a.x=Math.min(93,Math.max(7,a.x+direction*travel));a.moving=travel>0;
      }
    }
    b.units=b.units.filter(a=>a.hp>0||a.defeatedTicks>0);b.enemies=b.enemies.filter(a=>a.hp>0||a.defeatedTicks>0);
    if(b.adouHp<=0&&has(b,'guard3')&&!b.rescued){b.adouHp=30;b.rescued=true;effect(b,'heal',4,'+30');}
    // On simultaneous lethal hits the protected camp must survive to win.
    if(b.adouHp<=0)return 'loss';
    if(b.commandHp<=0)return 'win';
    return null;
  }
  window.ZhaoPush={troops,create,cost,deploy,charge,step};
})();
