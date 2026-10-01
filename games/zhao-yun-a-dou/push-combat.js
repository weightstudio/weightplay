/* Original horizontal push battle. Simulation uses 100 ms ticks and X=0..100.
 * Rendering, input, storage and audio are deliberately outside this module. */
(() => {
  'use strict';
  const troops = {
    blade: { cost:3, hp:62, damage:8, reach:8, speed:.46, period:14, cooldown:24 },
    spear: { cost:4, hp:44, damage:12, reach:11, speed:.43, period:16, cooldown:30 },
    bow:   { cost:5, hp:26, damage:9, reach:30, speed:.38, period:20, cooldown:45 },
    horse: { cost:7, hp:72, damage:19, reach:8, speed:.78, period:18, cooldown:65 },
    cannon:{ cost:10,hp:36,damage:48,reach:43,speed:.19,period:62,cooldown:100 },
    medic: { cost:6,hp:38,damage:3,reach:25,speed:.33,period:28,cooldown:60 },
    drummer:{cost:6,hp:58,damage:4,reach:9,speed:.34,period:28,cooldown:65 },
    scout: { cost:4,hp:28,damage:10,reach:7,speed:.95,period:12,cooldown:35 }
  };
  const has = (b,id) => b.talents.includes(id);
  const commandWeights={blade:1,spear:1,bow:2,horse:3,cannon:3,medic:2,drummer:2,scout:1};
  const weight=(b,key)=>commandWeights[b.army[key]?.role||key]||1;
  const capacity=b=>({soldiers:b.units.filter(unit=>unit.hp>0).length,command:b.units.filter(unit=>unit.hp>0).reduce((sum,unit)=>sum+weight(b,unit.cardId||unit.type),0),maxSoldiers:6,maxCommand:8});
  function deployReason(b,key){if(!b.loadout.includes(key)||b.result)return 'invalid';const used=capacity(b);if(used.soldiers>=6||used.command+weight(b,key)>8)return 'capacity';if(b.deployCooldown[key]>0)return 'cooldown';if(b.buns<cost(b,key))return 'supplies';return '';}
  const troop = (b,key) => ({...troops[b.army[key]?.role||key],...b.army[key]?.combat});
  function actor(b,key,enemy=false,bossKind=null) {
    const type=enemy?key:(b.army[key]?.role||key);
    const chapter=b.level.chapter-1;
    const normal={soldier:[34,6,8,.37,20],shield:[66,5,8,.27,23],raider:[32,10,8,.66,20],flanker:[30,7,24,.39,22],medic:[35,3,20,.30,26],bomber:[30,13,17,.31,42],drummer:[48,3,9,.29,28],arbalest:[38,12,32,.23,36]};
    const boss=Boolean(bossKind), row=normal[type]||normal.soldier, spec=troop(b,key);
    const card=enemy?null:b.army[key];
    const pressure=Math.max(0,b.level.id-1)*.017;
    const hp=enemy?Math.round((boss?175:row[0])*(1+chapter*.1+pressure)):Math.round(spec.hp*(card?.hp||1));
    return {id:b.nextActorId++,type,kind:type,boss,bossKind,enemy,x:enemy?93:7,previousX:enemy?93:7,
      hp,maxHp:hp,barrier:!enemy&&has(b,'aegis')?Math.round(hp*.45):0,maxBarrier:!enemy&&has(b,'aegis')?Math.round(hp*.45):0,damage:enemy?(boss?14:row[1])*(1+chapter*.08+pressure*.5):Math.round(spec.damage*(card?.damage||1)),
      reach:enemy?(boss?10:row[2]):spec.reach,speed:enemy?(boss?.28:row[3]):spec.speed,
      period:enemy?(boss?24:row[4]):spec.period,attackCooldown:0,attackFlash:0,hitFlash:0,stun:0,
      age:0,windup:null,defeatedTicks:0,moving:false,lastHitStrong:false,shield:type==='shield'||bossKind==='bulwark',charged:false,level:card?.stars||1,general:false,
      trait:card?.trait||'',rarity:card?.rarity||0,cardId:card?.id||null,model:card?.model||type,slow:0,inspired:false};
  }
  function create(level,talents=[],army={}) {
    talents=window.ZhaoTalents?.normalize(talents)||talents;
    const base=120, command=180+(level.chapter-1)*28;
    const b={level,talents:[...talents],army:JSON.parse(JSON.stringify(army)),units:[],enemies:[],ticks:0,buns:Math.max(8,Math.min(12,level.startingBuns||10)),
      adouHp:base,maxAdouHp:base,commandHp:command,maxCommandHp:command,wave:1,spawned:0,
      nextSpawn:35,nextActorId:1,nextEffectId:1,recruitIndex:0,deployCooldown:{},skillsUsed:{horse:0},
      chargeTicks:0,chargeBoosted:false,campFlash:0,combo:0,comboTicks:0,maxCombo:0,morale:0,furyTicks:0,echoTicks:0,echoDamage:0,effects:[],events:[],result:null,rescued:false,bossSpawned:false,status:''};
    const selection=Object.keys(b.army);
    b.loadout=selection.length?selection:['blade','spear','horse','bow'];
    b.units.push(actor(b,b.loadout[0]));return b;
  }
  function cost(b,type){return troop(b,type).cost;}
  function deploy(b,type) {
    if(deployReason(b,type))return false;
    b.buns-=cost(b,type);b.recruitIndex++;b.deployCooldown[type]=troop(b,type).cooldown;
    const unit=actor(b,type);b.units.push(unit);effect(b,'deploy',unit.x,'',unit.x,{sourceId:unit.id,ttl:8});b.events.push('deploy');return true;
  }
  function effect(b,kind,x,text='',fromX=x,visual={}) {
    const f={id:b.nextEffectId++,kind,x,fromX,text,ttl:kind==='defeat'?10:6,...visual};f.duration=f.ttl;b.effects.push(f);
    if(b.effects.length>32)b.effects.shift();
  }
  function damage(b,target,amount,type) {
    if(!target||target.hp<=0)return;
    let blocked=(target.shield&&type!=='blade'&&type!=='charge')||(target.trait==='shield'&&['bow','flanker','arbalest','medic','bomber','cannon'].includes(type));
    const raw=Math.max(1,Math.round(amount*(blocked?.4:1))),absorbed=Math.min(target.barrier||0,raw);
    if(absorbed){target.barrier-=absorbed;blocked=true;if(!target.barrier){effect(b,'shieldBreak',target.x,'',target.x,{targetId:target.id,ttl:8});for(const foe of b.enemies.filter(unit=>unit.hp>0&&Math.abs(unit.x-target.x)<14)){foe.x=Math.min(93,foe.x+3);foe.stun=Math.max(foe.stun,6);foe.windup=null;}b.events.push('block');}}
    const applied=Math.min(target.hp,raw-absorbed);
    target.hp-=applied;target.hitFlash=4;target.lastHitStrong=!blocked&&applied>=18;
    effect(b,blocked?'block':'hit',target.x,'−'+applied,target.x,{targetId:target.id,strong:target.lastHitStrong,enemy:target.enemy,weapon:type});
    b.events.push(blocked?'block':target.lastHitStrong?'critical':['bow','flanker','arbalest','medic'].includes(type)?'arrowHit':'hit');
    const previousMorale=b.morale;
    if(target.enemy&&type!=='charge')b.morale=Math.min(100,b.morale+1);
    if(target.hp<=0){
      target.defeatedTicks=8;target.windup=null;effect(b,'defeat',target.x,'',target.x,{targetId:target.id,enemy:target.enemy});b.events.push('defeat');
      if(target.enemy){
        b.combo=b.comboTicks>0?b.combo+1:1;b.comboTicks=60;b.maxCombo=Math.max(b.maxCombo,b.combo);b.morale=Math.min(100,b.morale+18);
        const bonus=b.combo%3===0?2:0,earned=Math.min(30-b.buns,(target.boss?5:1)+bonus);b.buns+=earned;
        if(earned)effect(b,'supply',target.x,'+'+earned,target.x,{amount:earned,ttl:9,targetId:target.id});
        if(b.combo>=2){effect(b,'combo',target.x,b.combo+'×',target.x,{ttl:10,strong:bonus>0});b.events.push('combo');}
        if(has(b,'fury')&&b.combo%3===0){b.furyTicks=40;effect(b,'fury',target.x,'',target.x,{ttl:10});b.events.push('fury');}
      }
    }
    if(previousMorale<100&&b.morale===100)b.events.push('morale');
    return applied;
  }
  function charge(b) {
    if(b.result||b.skillsUsed.horse>0||b.morale<50||!b.enemies.some(e=>e.hp>0))return false;
    b.chargeBoosted=b.morale>=100;b.morale-=b.chargeBoosted?100:50;
    for(const enemy of b.enemies.filter(e=>e.hp>0)){
      damage(b,enemy,24*(b.chargeBoosted?1.5:1),'charge');enemy.x=Math.min(93,enemy.x+(b.chargeBoosted?16:12));enemy.stun=b.chargeBoosted?14:10;
      enemy.windup=null;enemy.attackCooldown=Math.max(enemy.attackCooldown,10);
    }
    b.skillsUsed.horse=has(b,'storm')?75:100;b.chargeTicks=12;b.events.push('charge');effect(b,'charge',85,'',8,{strong:b.chargeBoosted,ttl:12});
    if(has(b,'storm')&&b.chargeBoosted){b.echoTicks=6;b.echoDamage=18;}
    return true;
  }
  function spawn(b,type,boss=null) {if(b.enemies.filter(e=>e.hp>0).length<18)b.enemies.push(actor(b,type,true,boss));}
  function step(b) {
    if(b.result)return b.result;
    b.ticks++;b.events=[];
    b.furyTicks=Math.max(0,b.furyTicks-1);
    if(b.echoTicks>0&&--b.echoTicks===0){for(const enemy of b.enemies.filter(unit=>unit.hp>0)){damage(b,enemy,b.echoDamage,'charge');enemy.x=Math.min(93,enemy.x+6);enemy.stun=Math.max(enemy.stun,6);enemy.windup=null;}b.chargeTicks=12;effect(b,'echo',85,'',8,{strong:true,ttl:12});b.events.push('echo');}
    b.comboTicks=Math.max(0,b.comboTicks-1);if(!b.comboTicks)b.combo=0;
    b.effects=b.effects.filter(f=>--f.ttl>0);
    for(const key of Object.keys(b.deployCooldown))b.deployCooldown[key]=Math.max(0,b.deployCooldown[key]-1);
    b.skillsUsed.horse=Math.max(0,b.skillsUsed.horse-1);b.chargeTicks=Math.max(0,b.chargeTicks-1);b.campFlash=Math.max(0,b.campFlash-1);
    if(b.ticks%18===0)b.buns=Math.min(30,b.buns+1);
    const count=12+(b.level.chapter-1)*2, gap=b.level.rule==='reserve'?30:b.level.rule==='rally'?19:25;
    if(b.ticks>=b.nextSpawn&&b.spawned<count){
      spawn(b,b.level.roster[b.spawned%b.level.roster.length]);b.spawned++;b.nextSpawn=b.ticks+gap;
      const nextWave=Math.min(3,1+Math.floor(b.spawned/(count/3)));
      if(nextWave>b.wave){b.wave=nextWave;b.nextSpawn+=25;b.buns=Math.min(30,b.buns+2);b.events.push('wave');}
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
      if(a.kind==='drummer'&&a.age%30===0)effect(b,'rally',a.x,'',a.x,{sourceId:a.id,enemy:a.enemy});
      if(a.bossKind==='bulwark')a.shield=a.age%65<40;
      if((a.kind==='medic'||a.bossKind==='healer')&&a.age%45===0){
        for(const target of friends.filter(f=>f.hp>0&&Math.abs(f.x-a.x)<24)){const heal=Math.min(a.enemy?6:Math.round(8*(1+(a.level-1)*.10)),target.maxHp-target.hp);target.hp+=heal;if(heal)effect(b,'heal',target.x,'+'+heal);}
      }
      if((a.bossKind==='summoner'||a.bossKind==='warlord')&&a.age%95===0)spawn(b,'soldier');
      if(a.windup){
        a.windup.ticks-=!a.enemy&&b.furyTicks>0?2:1;
        if(a.windup.ticks<=0){const hit=a.windup;a.windup=null;
          if(hit.target==='base'&&Math.abs((a.enemy?4:96)-a.x)<=a.reach+1){
            if(a.enemy){b.adouHp=Math.max(0,b.adouHp-a.damage);b.campFlash=5;b.events.push('hurt');effect(b,'hit',4,'−'+Math.round(a.damage));}
            else {const protectedFort=b.enemies.some(enemy=>enemy.boss&&enemy.hp>0),amount=protectedFort?0:a.damage;b.commandHp=Math.max(0,b.commandHp-amount);effect(b,protectedFort?'block':'hit',96,'−'+amount);if(a.type==='cannon'){effect(b,'blast',96,'',a.x,{strong:true});b.events.push('rocket');}}
          } else {
            const target=foes.find(f=>f.id===hit.target&&f.hp>0);
            if(target&&Math.abs(target.x-a.x)<=a.reach+5){
              const cavalry=target.kind==='raider'||target.bossKind==='charger';
              const amount=a.damage*(!a.enemy&&b.furyTicks>0?1.35:1)*(!a.enemy&&a.type==='spear'&&cavalry?1.8:1)*(!a.enemy&&a.type==='horse'&&!a.charged?1.6:1)*(a.trait==='ambush'&&!a.charged?2:1);
              const applied=damage(b,target,amount,a.type)||0;
              if(a.trait==='drain'){const heal=Math.min(a.maxHp-a.hp,Math.ceil(applied*.25));a.hp+=heal;if(heal)effect(b,'heal',a.x,'+'+heal);}
              if(a.trait==='slow')target.slow=30;
              if(a.trait==='push'){target.x=Math.min(93,target.x+4);target.stun=Math.max(target.stun,3);target.windup=null;}
              if(a.kind==='bomber'||a.trait==='blast'||a.trait==='cleave'||a.type==='cannon'||(a.trait==='burst'&&!a.charged)){
                for(const extra of foes.filter(f=>f.id!==target.id&&f.hp>0&&Math.abs(f.x-target.x)<(a.type==='cannon'?12:9)))damage(b,extra,amount*.6,a.type);
                effect(b,'blast',target.x,'',a.x,{strong:true,enemy:a.enemy});
                if(a.type==='cannon')b.events.push('rocket');
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
      if(a.attackCooldown>0)a.attackCooldown=Math.max(0,a.attackCooldown-(!a.enemy&&b.furyTicks>0?2:a.inspired?1.4:1));
      const reachable=foes.filter(f=>f.hp>0&&Math.abs(f.x-a.x)<=a.reach);
      reachable.sort((l,r)=>(!a.enemy&&a.type==='bow'?(Number(['medic','drummer','bomber'].includes(r.kind))-Number(['medic','drummer','bomber'].includes(l.kind))):0)||Math.abs(l.x-a.x)-Math.abs(r.x-a.x));
      const target=reachable[0],baseX=a.enemy?4:96,atBase=Math.abs(baseX-a.x)<=a.reach;
      if(target||atBase){
        if(a.attackCooldown===0){const windup=a.type==='cannon'?12:a.kind==='bomber'?10:a.kind==='arbalest'?6:4;a.attackCooldown=a.period;a.attackFlash=windup+3;a.windup={target:target?target.id:'base',ticks:windup,total:windup};effect(b,a.type==='cannon'?'rocket':a.kind==='bomber'?'bomb':a.type==='bow'||['flanker','arbalest','medic'].includes(a.kind)?'arrow':'attack',target?target.x:baseX,'',a.x,{sourceId:a.id,targetId:target?.id,enemy:a.enemy,ttl:windup+3,flight:windup});if(a.type!=='cannon'&&a.kind!=='bomber')b.events.push(a.type==='bow'||['flanker','arbalest','medic'].includes(a.kind)?'release':'swing');}
      }else{
        let speed=a.speed*(a.slow>0?.55:1);
        if(b.level.rule==='mud'&&a.x>35&&a.x<65)speed*=.6;
        if(a.bossKind==='weaver'&&a.age%60<18)speed*=2;
        const front=foes.filter(f=>f.hp>0&&(f.x-a.x)*direction>=0).sort((l,r)=>Math.abs(l.x-a.x)-Math.abs(r.x-a.x))[0];
        // Never cross an opposing foot anchor, even during fast movement.
        const leader=friends.filter(friend=>friend.id!==a.id&&friend.hp>0&&(friend.x-a.x)*direction>=0&&(friend.x!==a.x||friend.id<a.id)).sort((l,r)=>Math.abs(l.x-a.x)-Math.abs(r.x-a.x))[0];
        const formation=a.type==='horse'||a.kind==='raider'?speed:leader?Math.max(0,Math.abs(leader.x-a.x)-2.6):speed;
        const travel=Math.min(speed,formation,front?Math.max(0,Math.abs(front.x-a.x)-3):speed);
        a.x=Math.min(93,Math.max(7,a.x+direction*travel));a.moving=travel>0;
      }
    }
    b.units=b.units.filter(a=>a.hp>0||a.defeatedTicks>0);b.enemies=b.enemies.filter(a=>a.hp>0||a.defeatedTicks>0);
    // On simultaneous lethal hits the protected camp must survive to win.
    if(b.adouHp<=0)return 'loss';
    if(b.commandHp<=0)return 'win';
    return null;
  }
  window.ZhaoPush={troops,troop,create,cost,deploy,charge,step,weight,capacity,deployReason};
})();
