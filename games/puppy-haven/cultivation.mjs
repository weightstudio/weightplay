// Fictional puppy-care routes. Requirements and codex share this exact data.
export const CULTIVATION=[
 {breed:'corgi',meals:[3,0,0],pets:3},
 {breed:'labrador',meals:[0,3,0],pets:3},
 {breed:'husky',meals:[0,0,2],walk:45},
 {breed:'dalmatian',meals:[1,1,1],clean:85},
 {breed:'beagle',meals:[2,1,0],walk:45},
];
const bounded=(v,max=9999)=>Number.isFinite(v)?Math.max(0,Math.min(max,v)):0;
export function normalizeCare(raw){return {meals:Array.from({length:3},(_,i)=>Math.floor(bounded(raw?.meals?.[i]))),pets:Math.floor(bounded(raw?.pets)),walk:bounded(raw?.walk)};}
export function cultivationGoals(d){
 const plan=CULTIVATION.find(p=>p.breed===d.cultivation);if(!plan)return [];
 const care=normalizeCare(d.care),goals=[];
 plan.meals.forEach((need,grade)=>{if(need)goals.push({kind:'meal',grade,need,have:care.meals[grade]});});
 for(const kind of ['pets','walk','clean'])if(plan[kind])goals.push({kind,need:plan[kind],have:kind==='clean'?d.clean:care[kind]});
 return goals;
}
export function cultivationReady(d){return cultivationGoals(d).every(g=>g.have>=g.need);}
export function mealRemaining(state,bowl){const eater=state.dogs.find(d=>d.foodId===bowl.id&&d.activity==='eat');if(Number.isFinite(bowl.remaining))return Math.max(0,Math.min(100,Math.ceil(bowl.remaining/3*100)));return eater?Math.max(0,Math.min(100,Math.ceil((3-eater.eatTime)/3*100))):100;}
