// Authored order chambers. Mirroring changes the approach/landing side, never
// the arithmetic rules. Later rooms combine independent irreversible choices.
const copy=v=>JSON.parse(JSON.stringify(v));
const item=(id,kind,x,y,amount)=>({id,kind,x,y,amount});
function room({factor=2,bonus=10,last=48,shield=false,key=false,seals=false,escort=false,flag=false,spikes=false,mirror=false}={}){
 const l={board:['.......','.AA....','.......','BBBCCCC','.......','AAAAAAA','.......','#######'],hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:last}],items:[item('charge','multiply',5,2,factor),item('fruit','power',2,4,bonus),item('crown','crown',6,6)],required:['weak','last'],sealOrder:[]};
 if(shield){l.enemies[1].shield='sun';l.items.push({id:'rune',kind:'rune',x:2,y:4,link:'sun'});}
 if(key){l.board[7]='1111111';l.board.push('.......','#######');l.items.find(i=>i.kind==='crown').y=8;l.items.push({id:'key',kind:'key',x:4,y:6,link:'1'});}
 if(seals){l.sealOrder=['1','2'];l.items.push({id:'s1',kind:'seal',x:2,y:4,link:'1'},{id:'s2',kind:'seal',x:5,y:2,link:'2'});l.enemies[1].ordered=true;}
 if(escort){l.enemies.push({id:'escort',x:5,y:2,power:24});l.required.push('escort');}
 if(flag){l.enemies[0].buff={targets:['last'],amount:100};}
 if(spikes){l.board[5]='^AAAAAC';l.items.find(i=>i.kind==='crown').x=2;}
 if(mirror){l.board=l.board.map(r=>[...r].reverse().join(''));for(const a of [l.hero,...l.enemies,...l.items])a.x=6-a.x;}
 return l;
}
function chain(first,second){
 const a=copy(first),b=copy(second),offset=a.board.length-1;
 // The first guardian's landing is the next room entrance. Keep its support
 // until both its fight and the next room's advance preparation are ready.
 const entry=a.enemies.find(e=>e.id==='last').x;
 if(b.board[1][entry]==='.')throw Error('authored chamber entrance mismatch');
 a.items=a.items.filter(i=>i.kind!=='crown');a.board.pop();a.board.push(...b.board.slice(1));
 for(const e of b.enemies){e.y+=offset-1;if(e.next)e.next.y+=offset-1;e.id='next-'+e.id;if(e.buff)e.buff.targets=e.buff.targets.map(id=>'next-'+id);a.enemies.push(e);}
 for(const i of b.items){i.y+=offset-1;i.id='next-'+i.id;a.items.push(i);}
 a.required.push(...(b.required||[]).map(id=>'next-'+id));a.sealOrder=[...a.sealOrder,...b.sealOrder||[]];return a;
}

function duel({key=false,mirror=false,rune=false,factor=false,seals=false}={}){
 const l={board:['.......','AAA1CCC','.......','BBBBBBB','.......','CCCCCCC','.......','#######'],hero:{x:3,y:0,power:10},enemies:[{id:'weak',x:1,y:0,power:6},{id:'last',x:5,y:0,power:20}],items:[item('supply','sword',1,2,8),item('crown','crown',6,6)],required:['weak','last'],sealOrder:[]};
 l.items.push({id:'key',kind:'key',x:1,y:0,link:'1'});
 if(!key){l.board[1]='AAABCCC';l.items=l.items.filter(i=>i.id!=='key');}
 if(rune){l.enemies[1].shield='sun';l.items.push({id:'rune',kind:'rune',x:1,y:2,link:'sun'});}
 if(factor){l.items.push(item('charge','multiply',5,4,2));l.enemies.push({id:'captain',x:2,y:6,power:80});l.required.push('captain');}
 if(seals){l.sealOrder=['1','2'];l.items.push({id:'s1',kind:'seal',x:1,y:0,link:'1'},{id:'s2',kind:'seal',x:5,y:4,link:'2'});}
 if(mirror){l.board=l.board.map(r=>[...r].reverse().join(''));for(const a of [l.hero,...l.enemies,...l.items])a.x=6-a.x;}
 return l;
}

// Deliberately different rule combinations: power order, delayed enemy release,
// rune rescue, gate timing, seal sequence, spike supports and phased bosses.
export function challengeLevels(original){
 const levels=copy(original);
 const configs={
  5:{flag:true},6:{escort:true,last:90},7:{factor:3,last:70},8:{mirror:true,escort:true,last:90},
  9:{},10:{escort:true,flag:true,last:95},11:{key:true},12:{factor:4,last:95,key:true},
  13:{spikes:true,last:48},14:{key:true,mirror:true},15:{key:true,escort:true,last:95},
  16:{shield:true},17:{shield:true,mirror:true},18:{escort:true,last:90,spikes:true},
  19:{shield:true,key:true},20:{mirror:true,escort:true,last:95},21:{flag:true,shield:true},
  22:{escort:true,shield:true,last:95},23:{spikes:true,mirror:true},24:{seals:true,key:true},
  25:{shield:true,escort:true,last:95},26:{seals:true,escort:true,last:95},
  27:{shield:true,key:true,mirror:true},28:{flag:true,shield:true,escort:true,last:95},
  29:{spikes:true,shield:true,escort:true,last:95},30:{seals:true,shield:true,escort:true,last:95}
 };
 for(const [id,c]of Object.entries(configs)){const n=Number(id);Object.assign(levels[n-1],room(c));levels[n-1].decision='Prepare the lower landing before releasing the hero; compare growth before and after multiplication, then satisfy the encounter conditions.';if(n%5===0)levels[n-1].enemies.find(e=>e.id==='last').boss=true;}
 
 // Alternating chamber topology prevents learning one repeated click sequence.
 for(const [n,c]of [[6,{}],[8,{mirror:true}],[10,{factor:true}],[11,{key:true}],[14,{key:true,mirror:true}],[15,{key:true,factor:true}],[17,{rune:true}],[20,{mirror:true,factor:true}],[24,{key:true,seals:true}]])Object.assign(levels[n-1],duel(c));
 for(const [n,first,second]of [
 [12,room({factor:3,last:70}),room({mirror:true,escort:true,last:180})],
 [18,room({escort:true,last:90}),room({mirror:true,flag:true,last:220})],
 [19,duel({key:true}),room({mirror:true,shield:true,last:110})],
 [21,room({flag:true}),room({mirror:true,shield:true,last:170})],
 [22,duel({factor:true}),room({mirror:true,escort:true,last:240})],
 [26,room({seals:true}),duel({factor:true})],
 [27,duel({key:true}),room({mirror:true,shield:true,flag:true,last:110})],
 [28,room({flag:true,escort:true,last:95}),duel({rune:true,factor:true})],
 [29,room({spikes:true}),room({mirror:true,escort:true,last:180})],
 [30,room({flag:true,escort:true,last:95}),room({mirror:true,shield:true,seals:true,last:300})]
 ])Object.assign(levels[n-1],chain(first,second));
 Object.assign(levels[24],chain(room({flag:true}),original[24]));
 for(const n of [5,10,15,20,30]){const es=levels[n-1].enemies;const boss=es.find(e=>e.id==='captain')||es.find(e=>e.id==='next-last')||es.find(e=>e.id==='last');boss.boss=true;}
 levels[9].enemies.at(-1).requires=['weak','last'];
 levels[19].enemies.at(-1).direction='left';
 levels[29].sealOrder=['1','2','3'];levels[29].items.push({id:'next-s3',kind:'seal',x:1,y:10,link:'3'});
 const purposes={5:'Remove the flag before its boosted guardian, after growing before multiplication.',6:'Drop the strong guard away first; absorb the weak guard, then land on the sword before the return duel.',7:'Compare 26 × 3 with 16 × 3 + 10 before committing to the 70 guardian.',8:'The mirrored duel reverses the safe release side; use the landing sword before the strong guard.',9:'Keep the multiplier suspended until the lower addition and weak guard have increased the total.',10:'Absorb both deputies and preserve the multiplier landing before the captain.',11:'Keep the weak guard reachable until its key is collected; then release the sword landing.',12:'Plan both arithmetic rooms together; a lower support can rearrange the first room encounters.',13:'Preserve the separate edge support while transferring the multiplier onto the safe route.',14:'Read the mirrored key route rather than repeating the previous gate release side.',15:'Open the gate from the weak guard side, then multiply accumulated power for the captain.',16:'Bring the rune onto the growth landing before approaching the shield.',17:'Move the strong shield aside, reach the sword and rune, and then return to it.',18:'Combine a guarded multiplier room with a mirrored flag room; retain enough power for the later guardian.',19:'Resolve the key duel before the lower rune room; plan lower support removal in advance.',20:'The mirrored captain must be approached from the left after the multiplier.',21:'Neutralize the upper flag and preserve the lower rune landing before the second guardian.',22:'Do not let the lower room support turn the upper multiplier route into an early crown approach.',23:'Mirror the safe spike support and prevent supplies falling onto the exposed edge.',24:'Keep the first seal accessible before opening the second seal landing and crown route.',25:'Carry prepared power into the original two-phase castellan, whose gate exposes the second form.',26:'Complete the seal room before finishing the lower sword and multiplier duel.',27:'The lower flag still boosts its shielded guardian until killed; the rune alone is insufficient.',28:'Look ahead into the lower duel while arranging the upper flag and escorted multiplier.',29:'Retain a safe spike bridge while planning both rooms and the lower guarded multiplier.',30:'Plan the flag, escort, rune and three ordered seals across both rooms before the final guardian.'};
 for(const [id,decision]of Object.entries(purposes))levels[id-1].decision=decision;
 return levels;
}
