import { ENEMIES } from './campaign.js?v=4';
import { equipmentPower } from './loot.js?v=4';
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export class Combat {
  constructor(stage, loadout, mode, node = 0, upgrades = {}, options = {}) {
    Object.assign(this, { stage, loadout, mode, node, upgrades });
    this.power=equipmentPower(loadout,options.collection||{});
    this.autoAttack=options.autoAttack===true;this.queue=0;this.slashes=0;
    this.random=options.random||Math.random;
    this.companion=options.companion||'nibs';this.companionRank=options.companionRank||0;
    this.barrier=0;this.haste=0;this.enemyHits=0;this.burnTick=0;
    this.capacity=stage.id>=21?5:stage.id>=11?4:3;
    this.maxHp = 120 + (loadout.includes('bark-vest') ? 25 : 10)
      + this.power.health;
    Object.assign(this, {hp:this.maxHp,energy:100,allyCd:0,time:0,target:0,events:[],combo:0,auto:.45,
      pending:null,recovery:0,serial:0,hitstop:0,lastEnemyHit:-1,damageTaken:0});
    this.status = {crack:0,burn:0,chill:0}; this.enemies = [];
    (stage.encounters?.[node] || stage.enemies).forEach((id,i) => this.spawn(id,i));
    const slots=this.enemies.length===1?[1]:this.enemies.length===2?[0,2]:[0,1,2,3,4];
    this.enemies.forEach((e,i)=>{e.slot=slots[i];});
  }
  has(id) { return this.loadout.includes(id); }
  weapon() {
    const w = this.has('breaker-axe') ? {a:28,cycle:1.15} : this.has('quick-axe') ? {a:18,cycle:.75} : {a:24,cycle:1};
    w.a *= this.power.attack; return w;
  }
  spawn(id, index = this.alive().length) {
    const boss = id.startsWith('boss-'), def = ENEMIES[id] || ENEMIES.scout;
    const hp = Math.round((boss ? 230 + this.stage.id*4 : def.hp + Math.floor((this.stage.id-1)/5)*4)*(1.4+Math.min(.55,Math.max(0,this.stage.id-1)*.08)));
    const slot=[1,0,2,3,4].slice(0,this.capacity).find(slot=>!this.alive().some(e=>e.slot===slot));
    const pressure=1.2+Math.min(.25,this.stage.id*.005);
    const period=def.period*(this.stage.id<=10?.9:.95),opening=def.period*(this.stage.id<=10?.78:.9);
    const e = {...def,id,uid:++this.serial,damage:def.damage*pressure,period,hp,maxHp:hp,maxShield:def.shield||0,shield:def.shield||0,
      slot,t:opening+index*.65,warned:false,phase:1,casts:0,opening:0,reflect:0,boss,attackCount:0,disabledMirror:0};
    this.enemies.push(e);
    if (boss && ['boss-furnace','boss-loom','boss-stag','boss-heart'].includes(id)) {
      const children = id === 'boss-stag' ? ['mirror-left','mirror-right'] : id === 'boss-loom' ? ['root-drain','root-crack'] : ['anchor'];
      children.forEach((child,i) => this.spawn(child,i+1));
    }
    return e;
  }
  alive() { return this.enemies.filter(e => e.hp>0); }
  selected() { return this.alive()[Math.min(this.target,this.alive().length-1)]; }
  log(type,data={}) { this.events.push({type,...data}); }
  attack() {
    if(this.lost||this.won)return false;
    this.queue++;
    if(!this.pending)this.beginSwing();
    return true;
  }
  beginSwing(){
    if(!this.queue||!this.selected())return;
    this.queue--;this.slashes++;
    const heavy=this.slashes%8===0,windup=heavy?.09:this.has('trail-boots')?.045:.055;
    this.pending={target:this.selected(),time:windup,heavy};
    this.log('swing',{heavy,uid:this.pending.target.uid,windup,duration:heavy?.23:.15});
  }
  ally() {
    if (this.lost || this.won || this.energy<100 || this.allyCd>0) return false;
    this.energy=0; this.allyCd=4;const strength=1+this.companionRank*.08;
    if(this.companion==='nibs')for(const e of this.alive()){
      e.reflect=0;e.disabledMirror=2;this.stripShield(e,(35+(this.has('nut-charm')?8:0))*strength);
      this.damage(e,this.weapon().a*.9*strength,false,'ally');
    }
    if(this.companion==='moss'){
      this.heal(this.maxHp*.14*strength);this.barrier=Math.min(this.maxHp*.5,this.barrier+22*strength);
      this.status={crack:0,burn:0,chill:0};
    }
    if(this.companion==='frost')for(const e of this.alive()){
      e.slow=3.5+Math.min(3,this.companionRank*.1);e.t+=.5;
      this.damage(e,this.weapon().a*.65*strength,false,'frost');
    }
    if(this.companion==='ember')for(const e of this.alive()){
      this.damage(e,this.weapon().a*1.15*strength,false,'flame');e.burn=4;e.burnDamage=this.weapon().a*.18*strength;
    }
    if(this.has('iron-brace'))this.barrier=Math.min(this.maxHp*.5,this.barrier+12);
    if(this.has('lunar-charm')){this.status={crack:0,burn:0,chill:0};this.heal(this.maxHp*.06);}
    this.log('ally',{companion:this.companion}); return true;
  }
  heal(amount){const n=Math.min(this.maxHp-this.hp,amount);this.hp+=n;if(n>0)this.log('heal',{amount:Math.ceil(n)});}
  stripShield(e,amount) {
    const removed=Math.min(e.shield,amount); e.shield-=removed;
    if(removed&&!e.shield){e.opening=1.2;this.log('break',{uid:e.uid});} return removed;
  }
  hit(mult=1,heavy=false,e=this.selected()) {
    if(!e||e.hp<=0||this.lost)return;
    let amount=this.weapon().a*mult;
    if(heavy&&e.reflect>0){amount*=.65;this.stripShield(e,20);this.log('break',{uid:e.uid});}
    if(heavy&&e.opening>0){amount*=1.25;this.log('counter',{uid:e.uid});}
    this.combo++;if(this.has('rhythm-band')&&this.combo%3===0)amount*=1.5;
    const critical=this.random()<.18;
    if(critical)amount*=1.8;
    const effective=this.damage(e,amount,heavy,'axe',critical);
    if(effective&&this.has('quick-axe')&&this.combo%3===0){const next=this.alive().find(x=>x!==e);if(next)this.damage(next,this.weapon().a*.65,false,'lightning');}
    if(effective&&critical&&this.has('prism-visor'))this.energy=clamp(this.energy+18,0,100);
    if(heavy)for(const other of this.alive())if(other!==e)this.damage(other,amount*.45,false,'cleave',critical);
    if(effective&&!heavy)this.energy=clamp(this.energy+(this.has('quick-axe')?9:12)+(this.has('prism-visor')?3:0)+(this.gloveCharge?5:0),0,100);
    if(!heavy)this.gloveCharge=false;
    if(heavy){
      if(effective&&this.has('breaker-axe')){e.t+=1.2;this.log('interrupt',{uid:e.uid});}
      this.gloveCharge=this.has('trail-gloves');
      if(e.warned&&['mender','caller','boss-conductor'].includes(e.id)){
        e.t=e.period;e.warned=false;e.opening=1.2;this.log('interrupt',{uid:e.uid});
      }
    }
  }
  damage(e,amount,heavy,source='axe',critical=false) {
    const supports=this.alive().filter(x=>x!==e&&['anchor','mirror-left','mirror-right','root-drain','root-crack'].includes(x.id));
    const protectedCore=e.boss&&(supports.length>0||(e.id==='boss-heart'&&e.phase===3&&e.opening<=0));
    if(protectedCore){this.log('protected',{uid:e.uid});return 0;}
    const shieldBefore=e.shield;
    const shieldDamage=shieldBefore?this.stripShield(e,amount*(heavy?2:this.has('breaker-axe')?1.6:1)+(heavy&&this.has('breaker-axe')?20:0)):0;
    const healthDamage=Math.min(e.hp,shieldBefore?Math.max(0,amount-shieldBefore/(heavy?2:1)):amount);
    e.hp=Math.max(0,e.hp-healthDamage);
    this.log('hit',{uid:e.uid,amount:Math.ceil(healthDamage),shield:Math.ceil(shieldDamage),heavy,source,critical:critical&&(healthDamage+shieldDamage>0),protectedCore});
    if((heavy||critical)&&healthDamage>0)this.hitstop=critical?.055:.045;
    if(e.hp===0){
      this.log('defeat',{uid:e.uid,boss:e.boss,summon:e.summon===true});
      this.hp=Math.min(this.maxHp,this.hp+this.maxHp*.02);
      if(this.has('trail-hood'))this.status={crack:0,burn:0,chill:0};
      if(this.has('trail-boots'))this.haste=2;
      if(this.has('copper-ring')&&!e.summon)this.energy=clamp(this.energy+12,0,100);
      this.target=Math.min(this.target,Math.max(0,this.alive().length-1));
    }
    return healthDamage+shieldDamage;
  }
  playerDamage(amount,source,blockable=true) {
    if(amount<=0)return false;
    this.enemyHits++;
    if(this.has('scout-vest')&&this.enemyHits%5===0){this.log('dodge');return true;}
    const armor=this.has('bark-vest')?18:8; let d=amount*(.72+(this.stage.id-1)*.006)*(source?.boss?1.2:1)*(1-Math.min(.35,armor/(armor+100)));
    const absorbed=Math.min(this.barrier,d);this.barrier-=absorbed;d-=absorbed;
    if(absorbed)this.log('absorb',{amount:Math.ceil(absorbed)});
    this.hp=clamp(this.hp-d,0,this.maxHp);this.damageTaken+=d;
    if(d>0){this.lastCause='attack';this.log('hurt',{amount:Math.ceil(d),uid:source?.uid});if(this.has('bark-vest')&&source?.hp>0)this.damage(source,d*.35,false,'thorns');} return false;
  }
  special(e,blocked) {
    e.attackCount++;
    if(this.stage.id===6&&e.id==='shield')e.shield=Math.min(45,e.shield+8);
    if(e.id==='mender'){
      const a=this.alive().filter(x=>x!==e).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
      if(a){a.hp=Math.min(a.maxHp,a.hp+16);this.log('mend',{uid:a.uid});}
    }
    if(['anchor','boss-furnace'].includes(e.id))this.alive().filter(x=>x!==e&&x.id!=='anchor').forEach(x=>{x.shield=Math.min(60,x.shield+14);x.maxShield=Math.max(x.maxShield,x.shield);});
    if(e.id==='caller'||e.id==='boss-conductor'){
      if(e.id==='boss-conductor'&&e.attackCount%2===0)this.alive().forEach(x=>{x.shield=Math.min(60,x.shield+20);});
      else if(e.casts<(e.boss?4:2)&&this.alive().length<this.capacity){const c=this.spawn('scout');c.hp=c.maxHp=40;c.summon=true;e.casts++;this.log('summon',{uid:c.uid});}
    }
    if((e.id==='thorn'||e.id==='root-crack')&&!blocked&&!this.has('marsh-boots'))this.status.crack=4;
    if(e.id==='emberling'&&!blocked)this.status.burn=3;
    if(e.id==='frostguard'&&!blocked)this.status.chill=2;
    if(e.id==='siphon')this.energy=Math.max(0,this.energy-25);
    if(e.id==='root-drain')this.energy=Math.max(0,this.energy-8);
    if(e.id==='charger'||e.id==='boss-bell')e.opening=blocked?1.4:.6;
    if(e.id.startsWith('mirror')&&e.disabledMirror<=0)e.reflect=2;
  }
  bossRule(e) {
    if(!e.boss)return;
    const phase=e.hp<e.maxHp*.33?3:e.hp<e.maxHp*.7?2:1;if(phase<=e.phase)return;
    e.phase=phase;e.t=Math.max(e.t,2);e.warned=false;this.log('phase',{uid:e.uid,phase});
    if(e.id==='boss-furnace'&&phase===2&&this.alive().length<3)this.spawn('anchor');
    if(e.id==='boss-heart'){
      if(phase===2&&this.alive().length<3)this.spawn('mirror');
      if(phase===3){e.period=3;e.damage=26;}
    }
    if(e.id==='boss-stag'&&!this.alive().some(x=>x.id.startsWith('mirror-')))e.opening=4;
    if(e.id==='boss-bell')e.period=phase===2?3.6:2.8;
  }
  tick(dt) {
    if(this.lost||this.won)return;dt=clamp(dt,0,.05);
    if(this.hitstop>0){this.hitstop-=dt;return;}this.time+=dt;
    for(const k of ['allyCd','recovery','haste'])this[k]=Math.max(0,this[k]-dt);
    for(const k of Object.keys(this.status))this.status[k]=Math.max(0,this.status[k]-dt);
    if(this.status.burn>0){this.hp=Math.max(0,this.hp-1.5*dt);this.lastCause='burn';}
    if(this.status.crack>0){this.hp=Math.max(0,this.hp-(this.has('marsh-boots')?.35:.7)*dt);this.lastCause='crack';}
    if(this.autoAttack){
      this.auto=Math.max(0,this.auto-dt);
      if(this.auto<=0){
        this.auto=this.weapon().cycle*.6*(this.haste>0?.75:1)*(this.status.chill>0?1.4:1);
        const priority=['root-crack','root-drain','mirror-left','mirror-right','anchor','mender','siphon','caller'];
        const alive=this.alive(),support=alive.find(e=>priority.includes(e.id));
        if(support)this.target=alive.indexOf(support);
        if(this.queue===0)this.attack();
      }
      if(this.energy>=100)this.ally();
    }
    if(this.pending){
      this.pending.time-=dt;
      if(this.pending.time<=0){const a=this.pending;this.pending=null;this.hit(a.heavy?2.2:1,a.heavy,a.target);this.recovery=.025;}
    }else if(this.recovery<=0)this.beginSwing();
    for(const e of this.alive()){
      if(e.burn>0){e.burn=Math.max(0,e.burn-dt);e.burnClock=(e.burnClock||0)+dt;if(e.burnClock>=1){e.burnClock-=1;this.damage(e,e.burnDamage,false,'flame');}if(e.hp<=0)continue;}
      for(const k of ['opening','reflect','disabledMirror'])e[k]=Math.max(0,(e[k]||0)-dt);
      if(['mirror-left','mirror-right'].includes(e.id)&&e.disabledMirror<=0)e.reflect=(Math.floor(this.time/2)%2===(e.id==='mirror-left'?0:1))?1:0;
      this.bossRule(e);e.slow=Math.max(0,(e.slow||0)-dt);e.t-=dt*(e.slow>0?.5:1)*(e.id==='brute'&&e.hp<e.maxHp*.5?1.65:1);
      if(!e.warned&&e.t<=e.warn){e.warned=true;this.log('warning',{uid:e.uid});}
      if(e.t<=0&&this.time-this.lastEnemyHit>=.5){const blocked=this.playerDamage(e.damage,e);this.special(e,blocked);if(e.id==='boss-heart'&&e.phase===3)e.opening=2.4;this.lastEnemyHit=this.time;e.t=e.period+(e.id==='boss-bell'&&e.attackCount%3===2?.9:0);e.warned=false;}
    }
  }
  get won(){return this.hp>0&&this.alive().length===0;}
  get lost(){return this.hp<=0;}
}
