// Unconnected adapter candidate for the v43 Auto Squad combat object shape.
// It requires future stage data, localized cues, assets and verified save input.
import {createRelayWave,chooseRelayOrder,beginRelayWave,relayFirstStrikeTarget,relayEnemyAction,relayAdjustHealing} from './relay-candidate.mjs';

export function createRelayBridge({stage,wave,playerSquad,enemySquad,confirmedProgress,ops}){
  if(stage<=30)return null;
  if(!Array.isArray(playerSquad)||!Array.isArray(enemySquad)||!ops||typeof ops.getSupplies!=='function'||typeof ops.spendSupplies!=='function'||typeof ops.hit!=='function'||typeof ops.shield!=='function')throw new TypeError('invalid bridge');
  const teamSlots=()=>{
    const slots=Array(6).fill(null);
    for(const unit of playerSquad){
      const slot=unit?.formationSlot;
      if(!Number.isInteger(slot)||slot<0||slot>5||slots[slot])throw new TypeError('invalid player formation');
      slots[slot]=unit;
    }
    return slots;
  };
  const clone=()=>teamSlots().map(unit=>unit?{hp:Math.max(0,unit.hp),maxHp:unit.maxHp,shield:Math.max(0,unit.shieldHp||0)}:null);
  const layer=createRelayWave({stage,wave,allies:clone(),supplies:ops.getSupplies(),confirmedProgress});
  if(enemySquad.length!==layer.actors.length||enemySquad.some((unit,i)=>unit?.relayKind!==layer.actors[i].kind))throw new TypeError('enemy mapping mismatch');
  const enemies=new Map(layer.actors.map((actor,i)=>[actor.id,enemySquad[i]]));
  let phase='preparation';
  function synchronize(){
    layer.team=clone().map((unit,i)=>unit?{...unit,slot:i+1}:null);
    for(const actor of layer.actors){const live=enemies.get(actor.id);actor.alive=Boolean(live&&live.hp>0);}
  }
  function halt(reason){phase='halted';return {ok:false,reason};}
  function choose(type,target){if(phase!=='preparation')return {ok:false,reason:'order-locked'};const amount=ops.getSupplies();if(!Number.isSafeInteger(amount)||amount<0)return halt('supplies-unavailable');layer.supplies=amount;return chooseRelayOrder(layer,type,target);}
  function start(){
    if(phase!=='preparation')return {ok:false,reason:'order-locked'};
    try{
      layer.supplies=ops.getSupplies();if(!Number.isSafeInteger(layer.supplies)||layer.supplies<0)return halt('supplies-unavailable');const selected=layer.selected||{type:'none'};
      if(selected.type!=='none'&&layer.supplies<2)return {ok:false,reason:'insufficient-supplies'};
      // A thrown callback may have already committed: halt, never replay it.
      if(selected.type!=='none'&&ops.spendSupplies(2)!==true)return halt('debit-unconfirmed');
      const begun=beginRelayWave(layer);if(!begun.ok)return halt('candidate-start-failed');
      for(const part of layer.contributions)if(part.remaining>0)ops.shield(enemies.get(part.target),part.remaining,'enemy');
      if(selected.type==='ward'){const ally=teamSlots()[selected.target-1];if(ally&&ally.hp>0)ops.shield(ally,4,'player');}
      phase='battle';synchronize();return {ok:true};
    }catch{return halt('start-side-effect-unconfirmed');}
  }
  function firstStrike(defaultUnit){
    if(phase!=='battle')return defaultUnit;
    synchronize();const fallback=layer.actors.find(x=>enemies.get(x.id)===defaultUnit)?.id;
    return enemies.get(relayFirstStrikeTarget(layer,fallback))||defaultUnit;
  }
  function enemyAction(unit){
    if(phase!=='battle')return {ok:false,reason:'not-in-battle'};
    try{
      synchronize();const actor=layer.actors.find(x=>enemies.get(x.id)===unit);if(!actor)return halt('enemy-mapping-lost');
      const events=relayEnemyAction(layer,actor.id),cues=[];
      for(const event of events){
        if(event.type==='signal-hit'){
          // Each strike may kill or remove a unit. Resolve the next target from
          // the real formation, not from the draft clone's damage prediction.
          const slots=teamSlots(),marked=slots[event.markedSlot-1],target=marked?.hp>0?marked:slots.find(x=>x&&x.hp>0);
          if(!target){cues.push({type:'no-target',source:event.source,markedSlot:event.markedSlot});continue;}
          // Existing damageTarget owns guard tactic, shield, criticals, audio,
          // visuals and truth; clone predictions are never copied to runtime.
          ops.hit(target,event.amount);
          cues.push({type:event.type,source:event.source,markedSlot:event.markedSlot,targetSlot:slots.indexOf(target)+1,amount:event.amount});
          synchronize();
        }else{if(event.type==='boss-shield')ops.shield(enemies.get(event.target||event.source),event.amount,'enemy');cues.push(event);}
      }
      // Do not expose the clone's predicted damage as the authoritative
      // result: v43 applies tactics, shields and combo bonuses in ops.hit.
      synchronize();return {ok:true,events:cues};
    }catch{return halt('combat-side-effect-unconfirmed');}
  }
  function adjustHealing(amount){if(phase!=='battle')return {ok:false,reason:'not-in-battle'};try{return {ok:true,...relayAdjustHealing(layer,amount)};}catch{return halt('invalid-heal');}}
  return Object.freeze({choose,start,firstStrike,enemyAction,adjustHealing,preview:()=>({marks:layer.marks.map(x=>({...x})),bossCues:layer.bossCues.map(x=>({actor:x.actor,signals:[...x.signals]})),wardTargets:[...layer.wardTargets],orders:[...layer.orders],phase})});
}
