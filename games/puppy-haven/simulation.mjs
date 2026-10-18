export const BREEDS = [
  {id:'shiba', en:'Shiba', zh:'柴犬', price:90, coat:0xd99648, cream:0xffedce, ears:'up'},
  {id:'corgi', en:'Corgi', zh:'柯基', price:110, coat:0xc98342, cream:0xfff2d8, ears:'up', long:true},
  {id:'labrador', en:'Labrador', zh:'拉布拉多', price:120, coat:0xe6bc72, cream:0xffe8b1, ears:'down'},
  {id:'husky', en:'Husky', zh:'哈士奇', price:140, coat:0x657683, cream:0xeaf4f4, ears:'up'},
  {id:'dalmatian', en:'Dalmatian', zh:'大麥町', price:150, coat:0xf1eee5, cream:0x343b44, ears:'down', spots:true},
  {id:'beagle', en:'Beagle', zh:'米格魯', price:120, coat:0xb9824b, cream:0xffefd5, ears:'down', saddle:true},
];
export const FOOD = [
  {id:'basic',en:'Basic',zh:'基礎飼料',price:12,pack:5,nutrition:26,growth:10},
  {id:'premium',en:'Premium',zh:'優質飼料',price:28,pack:5,nutrition:40,growth:22},
  {id:'gourmet',en:'Gourmet',zh:'頂級鮮食',price:60,pack:5,nutrition:58,growth:35},
];
export const MISSIONS = [
 ['Welcome meal','第一餐','Feed a dog','餵狗狗吃一餐',25],
 ['Clean path','乾淨小徑','Clean a dropping, then pet a dog','清理便便後摸摸狗狗',25],
 ['Make friends','交個朋友','Pet two different dogs','摸摸兩隻不同的狗狗',30],
 ['A better pantry','升級餐櫃','Buy and feed premium food','購買並餵食優質飼料',30],
 ["Taro’s inspection",'Taro 的巡院','Feed both dogs; all needs ≥60; no droppings','餵兩隻狗，全部需求達60，庭院無便便',50],
 ['New neighbor','新鄰居','Adopt a Corgi or pet your own Corgi','領養柯基，或摸摸已領養的柯基',40],
 ['Full bowls','碗碗飽足','Feed three different dogs','餵食三隻不同的狗狗',40],
 ['Gourmet day','鮮食日','Buy and feed gourmet food','購買並餵食頂級鮮食',45],
 ['Little routine','照顧小習慣','Pet → clean → feed, in order','依序摸摸 → 清便便 → 餵食',45],
 ['Open house','小院開放日','Three dogs, all needs ≥65, clean yard','至少三隻狗，全部需求達65，庭院乾淨',75],
 ['A suitable pair','幸福配對','Pair healthy unrelated adult dogs','讓健康且無親緣的成犬配對',50],
 ['Welcome, puppy','歡迎小狗','Welcome a newborn puppy','迎接一隻新生幼犬',55],
 ['Baby bowl','幼犬餐碗','Feed a puppy','餵食一隻幼犬',55],
 ['Growing together','一起長大','Raise a puppy to adulthood','照顧幼犬直到長大',60],
 ['Family album','家庭相簿','Feed a parent and its child','餵食一對親子',90],
 ['Snow visitor','雪地訪客','Adopt a Husky or pet your own Husky','領養哈士奇，或摸摸已領養的哈士奇',60],
 ['Gentle welcome','溫柔迎接','Adopt or bring a dog home, then pet it','領養或接回狗狗，再摸摸牠',60],
 ['Spotted friend','斑點好朋友','Adopt a Dalmatian or pet your own Dalmatian','領養大麥町，或摸摸已領養的大麥町',65],
 ['Thoughtful menu','均衡菜單','Feed all three food grades','餵過三種等級的食物',65],
 ['Garden festival','庭院慶典','Four breeds, all needs ≥65, clean yard','四個犬種，全部需求達65，庭院乾淨',100],
 ['Golden guest','金色訪客','Adopt a Labrador or pet your own Labrador','領養拉布拉多，或摸摸已領養的拉布拉多',70],
 ['Long ears','長耳朵來了','Adopt a Beagle or pet your own Beagle','領養米格魯，或摸摸已領養的米格魯',70],
 ['Family planning','家庭計畫','Start another healthy pregnancy','再迎接一次健康懷孕',75],
 ['Shared attention','每隻都關心','Pet six different dogs','摸摸六隻不同的狗狗',75],
 ['Nursery inspection','育幼巡查','Two births total; feed a puppy; clean yard','累計兩次出生、餵過幼犬、庭院乾淨',110],
 ['Balanced pantry','豐富餐櫃','Buy all grades and keep some of each','買過三種食物，且每種都有存量',80],
 ['Careful hands','細心照顧','Clean → pet → premium meal','依序清便便 → 摸摸 → 優質餐',80],
 ['Across generations','兩代同堂','Feed both an adult and a puppy','各餵食成犬與幼犬',85],
 ['Ready for visitors','準備迎賓','Six breeds, all needs ≥65, clean yard','六個犬種，全部需求達65，庭院乾淨',90],
 ['Haven celebration','幸福小院','Six breeds, two generations, all ≥70; feed all grades','六犬種、兩代、全部需求70；餵過三種食物',150],
].map((r,i)=>({id:i+1,en:r[0],zh:r[1],goalEn:r[2],goalZh:r[3],reward:r[4],checkpoint:(i+1)%5===0}));

const clamp=(n,a=0,b=100)=>Math.min(b,Math.max(a,Number.isFinite(Number(n))?Number(n):a));
export const YARD_CAPACITY=12, REST_CAPACITY=500;
const blankRun=()=>({feeds:[],pets:[],clean:0,bought:[],adopted:[],welcomed:[],pairs:0,births:0,matured:0,puppyFed:false,adultFed:false,sequence:[],complete:false});
function makeDog(id,breed,sex,parents=[],puppy=false){return {id,breed,sex,parents,age:puppy?'puppy':'adult',growth:puppy?0:100,activeAge:0,hunger:puppy?65:72,happy:72,clean:85,cooldown:0,pregnancy:null,poopIn:18+id%4*6,petIn:0};}
export function freshState(){return {schema:1,coins:360,food:[12,3,1],dogs:[makeDog(1,'shiba','M'),makeDog(2,'shiba','F')],restDogs:[],poops:[],nextId:3,clock:0,births:0,unlocked:1,cleared:[],selected:1,stage:0,run:blankRun()};}
export function normalizeState(raw){
 const s=freshState();if(!raw||raw.schema!==1)return s;
 s.coins=clamp(raw.coins,0,999999);s.food=FOOD.map((_,i)=>Math.floor(clamp(raw.food?.[i],0,999)));
 const ids=new Set();s.dogs=[];s.restDogs=[];
 const active=Array.isArray(raw.dogs)?raw.dogs.slice(0,YARD_CAPACITY):[];
 const resting=Array.isArray(raw.restDogs)?raw.restDogs.slice(0,REST_CAPACITY):[];
 for(const [d,isResting] of [...active.map(d=>[d,false]),...resting.map(d=>[d,true])]){
  if(!d||typeof d!=='object')continue;
  if(!Number.isSafeInteger(d.id)||d.id<1||ids.has(d.id)||!BREEDS.some(b=>b.id===d.breed)||!['M','F'].includes(d.sex))continue;
  ids.add(d.id);const dog=makeDog(d.id,d.breed,d.sex,[],d.age==='puppy');
  for(const k of ['hunger','happy','clean','growth'])dog[k]=clamp(d[k]);
  dog.activeAge=clamp(d.activeAge,0,999999);dog.cooldown=clamp(d.cooldown,0,180);dog.poopIn=clamp(d.poopIn,2,65);dog.petIn=clamp(d.petIn,0,8);
  // Preserve absent ancestors as IDs; deleting them would erase kinship.
  dog.parents=Array.isArray(d.parents)?[...new Set(d.parents.filter(id=>Number.isSafeInteger(id)&&id>0&&id<d.id))].slice(0,2):[];
  if(d.pregnancy&&dog.sex==='F'&&dog.age==='adult'&&Number.isSafeInteger(d.pregnancy.father)&&d.pregnancy.father>0){
   dog.pregnancy={father:d.pregnancy.father,remaining:clamp(d.pregnancy.remaining,0,45),breed:BREEDS.some(b=>b.id===d.pregnancy.breed)?d.pregnancy.breed:dog.breed,sex:d.pregnancy.sex==='F'?'F':'M'};
  }
  if(isResting){dog.pregnancy=null;s.restDogs.push(dog);}else s.dogs.push(dog);
 }
 if(!s.dogs.length&&s.restDogs.length)s.dogs.push(s.restDogs.shift());
 if(!s.dogs.length)return freshState();
 let capacity=YARD_CAPACITY-s.dogs.length;for(const d of s.dogs){if(d.pregnancy){if(capacity>0)capacity--;else d.pregnancy=null;}}
 s.nextId=Math.max(...s.dogs.concat(s.restDogs).map(d=>d.id))+1;
 s.clock=clamp(raw.clock,0,9999999);s.births=Math.floor(clamp(raw.births,0,99999));
 s.cleared=[...new Set((Array.isArray(raw.cleared)?raw.cleared:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=30))];
 s.unlocked=1;while(s.unlocked<30&&s.cleared.includes(s.unlocked))s.unlocked++;
 s.selected=s.dogs.some(d=>d.id===raw.selected)?raw.selected:s.dogs[0].id;
 const seenPoops=new Set(ids);
 s.poops=(Array.isArray(raw.poops)?raw.poops:[]).slice(0,24).filter(p=>{if(!p||!Number.isSafeInteger(p.id)||p.id<1||seenPoops.has(p.id))return false;seenPoops.add(p.id);return true;}).map(p=>({id:p.id,x:clamp(p.x,-3.2,3.2),z:clamp(p.z,-2,2.5)}));
 s.nextId=Math.max(s.nextId,...s.poops.map(p=>p.id+1));if(Number.isSafeInteger(raw.nextId)&&raw.nextId<Number.MAX_SAFE_INTEGER)s.nextId=Math.max(s.nextId,raw.nextId);return s;
}
export class Haven {
 constructor(state=freshState(),random=Math.random){this.s=state;this.random=random;this.events=[];}
 get selected(){return this.s.dogs.find(d=>d.id===this.s.selected)||this.s.dogs[0];}
 get allDogs(){return this.s.dogs.concat(this.s.restDogs||[]);}
 get reserved(){return this.s.dogs.length+this.s.dogs.filter(d=>d.pregnancy).length;}
 emit(type,data={}){this.events.push({type,...data});}
 start(stage=0){if(!Number.isInteger(stage)||stage<0||stage>this.s.unlocked)return false;this.s.stage=stage;this.s.run=blankRun();this.events=[];return true;}
 select(id){if(!this.s.dogs.some(d=>d.id===id))return false;this.s.selected=id;return true;}
 reject(reason){this.emit('error',{reason});return {ok:false,reason};}
 action(type,data={}){
  const s=this.s,d=this.selected,r=s.run;let result;
  if(type==='feed'){
   const grade=Number(data.grade);if(!Number.isInteger(grade)||!FOOD[grade])return this.reject('invalid');
   if(d.hunger>90)return this.reject('full');if(s.food[grade]<1)return this.reject('noFood');
   s.food[grade]--;d.hunger=clamp(d.hunger+FOOD[grade].nutrition);d.happy=clamp(d.happy+5);
   if(d.age==='puppy'){d.growth=clamp(d.growth+FOOD[grade].growth);r.puppyFed=true;}else r.adultFed=true;
   if(!r.feeds.some(f=>f.id===d.id&&f.grade===grade))r.feeds.push({id:d.id,grade});this.sequence(grade===1?'premium':'feed');result={dog:d.id,grade};
  }else if(type==='pet'){
   if(d.petIn>0)return this.reject('rest');d.happy=clamp(d.happy+22);d.petIn=8;s.coins+=3;if(!r.pets.includes(d.id))r.pets.push(d.id);this.sequence('pet');result={dog:d.id,coins:3};
  }else if(type==='clean'){
   const index=data.id===undefined?0:s.poops.findIndex(p=>p.id===data.id);if(index<0||!s.poops.length)return this.reject('alreadyClean');
   const [poop]=s.poops.splice(index,1);s.coins+=5;r.clean++;for(const dog of s.dogs)dog.clean=clamp(dog.clean+18);this.sequence('clean');result={poop,coins:5};
  }else if(type==='buy'){
   const grade=Number(data.grade),f=FOOD[grade];if(!Number.isInteger(grade)||!f)return this.reject('invalid');if(s.coins<f.price)return this.reject('coins');if(s.food[grade]>994)return this.reject('stock');
   s.coins-=f.price;s.food[grade]+=f.pack;if(!r.bought.includes(grade))r.bought.push(grade);result={grade};
  }else if(type==='adopt'){
   const breed=BREEDS.find(b=>b.id===data.breed);if(!breed||!['M','F'].includes(data.sex))return this.reject('invalid');
   if(this.reserved>=YARD_CAPACITY)return this.reject('capacity');if(s.coins<breed.price)return this.reject('coins');
   s.coins-=breed.price;const dog=makeDog(s.nextId++,breed.id,data.sex);s.dogs.push(dog);s.selected=dog.id;r.adopted.push(dog.id);r.welcomed.push(dog.id);result={dog:dog.id};
  }else if(type==='restDog'){
   if(s.dogs.length<=1)return this.reject('lastDog');
   if(d.pregnancy)return this.reject('expectingRest');
   if(s.restDogs.length>=REST_CAPACITY)return this.reject('restFull');
   s.dogs.splice(s.dogs.indexOf(d),1);s.restDogs.push(d);s.selected=s.dogs[0].id;result={dog:d.id};
  }else if(type==='recallDog'){
   const index=s.restDogs.findIndex(dog=>dog.id===Number(data.id));if(index<0)return this.reject('invalid');
   if(this.reserved>=YARD_CAPACITY)return this.reject('capacity');
   const [dog]=s.restDogs.splice(index,1);s.dogs.push(dog);s.selected=dog.id;if(!r.welcomed.includes(dog.id))r.welcomed.push(dog.id);result={dog:dog.id};
  }else if(type==='pair'){
   const father=s.dogs.find(dog=>dog.id===Number(data.father)),mother=s.dogs.find(dog=>dog.id===Number(data.mother));
   const reason=this.pairReason(father,mother);if(reason)return this.reject(reason);
   mother.pregnancy={father:father.id,remaining:45,breed:this.random()<.5?mother.breed:father.breed,sex:this.random()<.5?'M':'F'};
   father.cooldown=180;mother.cooldown=180;r.pairs++;result={dog:mother.id};
  }else return this.reject('invalid');
  this.emit(type,result);this.check();return {ok:true,...result};
 }
 ancestors(d,seen=new Set()){if(!d)return seen;for(const id of d.parents){if(seen.has(id))continue;seen.add(id);this.ancestors(this.allDogs.find(p=>p.id===id),seen);}return seen;}
 pairReason(father,mother){
  if(!father||!mother||father.id===mother.id||father.sex!=='M'||mother.sex!=='F')return 'sex';
  if(father.age!=='adult'||mother.age!=='adult')return 'adult';
  if(mother.pregnancy)return 'pregnant';if(father.cooldown>0||mother.cooldown>0)return 'cooldown';
  const fa=this.ancestors(father),ma=this.ancestors(mother);if(fa.has(mother.id)||ma.has(father.id)||[...fa].some(id=>ma.has(id)))return 'related';
  if([father,mother].some(d=>Math.min(d.hunger,d.happy,d.clean)<60))return 'needs';if(this.reserved>=YARD_CAPACITY)return 'capacity';return '';
 }
 sequence(action){const seq=this.s.run.sequence;seq.push(action);if(seq.length>3)seq.shift();}
 tick(seconds){
  const dt=clamp(seconds,0,.25),s=this.s;s.clock+=dt;
  for(const d of s.restDogs){d.cooldown=Math.max(0,d.cooldown-dt);d.petIn=Math.max(0,d.petIn-dt);}
  for(const d of [...s.dogs]){
   d.activeAge+=dt;d.hunger=clamp(d.hunger-dt*.11);d.happy=clamp(d.happy-dt*.055);d.clean=clamp(d.clean-dt*s.poops.length*.025);
   d.petIn=Math.max(0,d.petIn-dt);d.cooldown=Math.max(0,d.cooldown-dt);d.poopIn-=dt;
   if(d.poopIn<=0){d.poopIn=45+this.random()*20;if(s.poops.length<24){const poop={id:s.nextId++,x:(this.random()-.5)*6,z:(this.random()-.5)*4};s.poops.push(poop);d.clean=clamp(d.clean-10);this.emit('poop',{poop});}}
   if(d.age==='puppy'){if(d.hunger>=50&&d.happy>=50)d.growth=clamp(d.growth+dt*.25);if(d.growth>=100&&d.activeAge>=60){d.age='adult';s.run.matured++;this.emit('growth',{dog:d.id});}}
   if(d.pregnancy){d.pregnancy.remaining=Math.max(0,d.pregnancy.remaining-dt);if(d.pregnancy.remaining===0){const p=d.pregnancy;d.pregnancy=null;const baby=makeDog(s.nextId++,p.breed,p.sex,[p.father,d.id],true);s.dogs.push(baby);s.births++;s.run.births++;this.emit('birth',{dog:baby.id});}}
  }this.check();
 }
 objective(){
  const s=this.s,r=s.run,n=s.stage,all=this.allDogs,feeds=new Set(r.feeds.map(f=>f.id)),pets=new Set(r.pets),grades=new Set(r.feeds.map(f=>f.grade)),breeds=new Set(all.map(d=>d.breed));
  const healthy=(min,count=0)=>s.dogs.length>=count&&s.poops.length===0&&all.every(d=>Math.min(d.hunger,d.happy,d.clean)>=min);
  const adopted=breed=>r.adopted.concat(r.pets).some(id=>all.find(d=>d.id===id)?.breed===breed);
  const seq=r.sequence.join(','),cared=r.feeds.length+r.pets.length+r.clean>0;
  return [false,r.feeds.length>0,r.sequence.slice(-2).join(',')==='clean,pet',pets.size>=2,r.bought.includes(1)&&grades.has(1),feeds.size>=2&&healthy(60),adopted('corgi'),feeds.size>=3,r.bought.includes(2)&&grades.has(2),seq==='pet,clean,feed'||seq==='pet,clean,premium',healthy(65,3)&&cared,r.pairs>0,r.births>0,r.puppyFed,r.matured>0,all.some(d=>feeds.has(d.id)&&d.parents.some(id=>feeds.has(id))),adopted('husky'),r.welcomed.some(id=>pets.has(id)),adopted('dalmatian'),grades.size===3,breeds.size>=4&&healthy(65)&&cared,adopted('labrador'),adopted('beagle'),r.pairs>0,pets.size>=6,s.births>=2&&r.puppyFed&&s.poops.length===0,new Set(r.bought).size===3&&s.food.every(v=>v>0),seq==='clean,pet,premium',r.adultFed&&r.puppyFed,breeds.size===6&&healthy(65)&&cared,breeds.size===6&&all.some(d=>d.parents.length===2)&&healthy(70)&&grades.size===3][n]||false;
 }
 check(){const s=this.s;if(s.stage&& !s.run.complete&&this.objective()){
  s.run.complete=true;const first=!s.cleared.includes(s.stage);if(first){s.cleared.push(s.stage);s.coins+=MISSIONS[s.stage-1].reward;}s.unlocked=Math.max(s.unlocked,Math.min(30,s.stage+1));this.emit('complete',{stage:s.stage,reward:first?MISSIONS[s.stage-1].reward:0});
 }}
}
