export const BASE_STOCK_CAPACITY=40;
export const COOLER_STOCK_BONUS=30;
export const BASE_BROWSE_SECONDS=.27;
export const COOLER_BROWSE_SECONDS=.12;
export const BASE_CHECKOUT_SECONDS=1.4;
export const FAST_CHECKOUT_SECONDS=.7;
export const RECOVERY_WATER_QUANTITY=4;
export const RECOVERY_ORDER_LIMIT=2;
export const RECOVERY_DELIVERY_FEE=8;
export const CASH_LEDGER_LIMIT=60;
export const EMPLOYEE_HIRE_COST=180;
export const EMPLOYEE_SKILL_LIMIT=5;
export const EMPLOYEE_RESTOCK_BATCH=4;

export const BUSINESS_UPGRADE_LIMIT=5;
export function migrateBusinessUpgrades(state={}){
  const existing=state.businessUpgrades?.schemaVersion===1;
  const legacy=existing?structuredClone(state.businessUpgrades.legacySkills||{}):{};
  const employees=(state.employees||[]).map(employee=>{
    if(!existing)legacy[employee.id]={checkout:Math.min(5,count(employee.skills?.checkout)),restock:Math.min(5,count(employee.skills?.restock))};
    return {...employee,skills:{checkout:0,restock:0}};
  });
  const levels=Object.fromEntries(['checkout','restock','storage'].map(id=>[id,Math.min(BUSINESS_UPGRADE_LIMIT,count(state.businessUpgrades?.levels?.[id]))]));
  return {...state,employees,businessUpgrades:{schemaVersion:1,levels,legacySkills:legacy}};
}
export function trainedEmployee(employee={},upgrades={}){
  const inherited=upgrades.legacySkills?.[employee.id]||employee.skills||{};
  return {...employee,skills:{checkout:count(inherited.checkout)+count(upgrades.levels?.checkout),restock:count(inherited.restock)+count(upgrades.levels?.restock)}};
}
export function businessUpgradeCost(id,level=0){
  const base={checkout:240,restock:200,storage:180}[id];
  return base&&count(level)<BUSINESS_UPGRADE_LIMIT?base*(count(level)+1):0;
}
export function purchaseBusinessUpgrade(state,id,expectedLevel=state.businessUpgrades?.levels?.[id]||0){
  const normalized=migrateBusinessUpgrades(state),level=normalized.businessUpgrades.levels[id],cost=businessUpgradeCost(id,level);
  if(level!==expectedLevel)return {ok:false,reason:'stale',state};
  if(!cost)return {ok:false,reason:'max',state};
  const result=spendCash(normalized,cost,'businessUpgrade',{detail:id});
  if(!result.ok)return {...result,state};
  result.state.businessUpgrades.levels[id]=level+1;
  return result;
}
export const EXPANSIONS=Object.freeze([{from:10,to:13,cost:500},{from:13,to:16,cost:1400},{from:16,to:19,cost:3500},{from:19,to:22,cost:8000}]);
export function purchaseExpansion(state,expectedArea=state.area){
  if(state.area!==expectedArea)return {ok:false,reason:'stale',state};
  const offer=EXPANSIONS.find(item=>item.from===state.area);
  if(!offer)return {ok:false,reason:'max',state};
  const result=spendCash(state,offer.cost,'expansion',{detail:String(offer.to)});
  if(result.ok){
    const shift=points=>Array.isArray(points)?points.map(point=>({...point,x:point.x===offer.from-1?offer.to-1:point.x,z:point.z===offer.from-1?offer.to-1:point.z})):points;
    result.state={...result.state,area:offer.to,milestones:{...state.milestones,expanded:true},...(state.entrances?{entrances:shift(state.entrances)}:{}),...(state.exits?{exits:shift(state.exits)}:{})};
  }
  return result;
}
export function normalizeBusinessPerformance(value={}){
  return {schemaVersion:1,visits:count(value.visits),walkouts:count(value.walkouts),stockouts:count(value.stockouts),paidProducts:[...new Set((value.paidProducts||[]).filter(id=>typeof id==='string'))].slice(0,32),
    sales:(Array.isArray(value.sales)?value.sales:[]).filter(row=>row&&typeof row.product==='string'&&Number.isFinite(row.time)&&row.time>=0&&Number.isFinite(row.gross)&&row.gross>=0&&Number.isFinite(row.cost)&&row.cost>=0).slice(-256)};
}
export function recordBusinessSale(value,row){
  const next=normalizeBusinessPerformance(value);
  if(!row||typeof row.product!=='string'||!Number.isFinite(row.time)||!Number.isFinite(row.gross)||!Number.isFinite(row.cost))return next;
  next.paidProducts=[...new Set([...next.paidProducts,row.product])].slice(0,32);
  next.sales=[...next.sales.filter(s=>s.time>=row.time-180),{...row}].slice(-256);
  return next;
}
export function businessPerformance(value,activeSeconds,product=null){
  const state=normalizeBusinessPerformance(value),sales=state.sales.filter(row=>row.time>=activeSeconds-180&&row.time<=activeSeconds&&(!product||row.product===product));
  return {payments:sales.length,gross:sales.reduce((sum,row)=>sum+row.gross,0),margin:sales.reduce((sum,row)=>sum+row.gross-row.cost,0),waiting:sales.length?sales.reduce((sum,row)=>sum+(row.wait||0),0)/sales.length:0};
}

// Cursor covers only elapsed time reported by a live lifecycle lease. A fresh
// document starts at now; no wall-clock gap from a closed page is rewarded.
export function liveElapsedWindow(cursor,start,end){
  if(![cursor,start,end].every(Number.isFinite)||end<start)return {milliseconds:0,cursor:Number.isFinite(cursor)?cursor:0};
  if(end<cursor)return {milliseconds:0,cursor:end};
  return {milliseconds:Math.max(0,end-Math.max(cursor,start)),cursor:Math.max(cursor,end)};
}
export function simulationSteps(pendingMs,stepMs=50,limit=200){
  const steps=Math.min(limit,Math.floor(Math.max(0,pendingMs)/stepMs));
  return {steps,remainingMs:Math.max(0,pendingMs)-steps*stepMs};
}

export function employeeCheckoutSeconds(employee={},equipment={}){
  return Math.max(.55,3.5*Math.pow(.8,count(employee.skills?.checkout))*(equipment.fastCheckout ? .5 : 1));
}
export function employeeRestockSeconds(employee={}){
  return Math.max(2,12*Math.pow(.82,count(employee.skills?.restock)));
}
export function employeeSkillCost(skill,level=0){
  if(!['checkout','restock'].includes(skill)||count(level)>=EMPLOYEE_SKILL_LIMIT)return 0;
  return (skill==='checkout'?80:70)*(count(level)+1);
}

export function migrateEmployees(saved={},placed=[],stored=[]){
  const counters=placed.filter(f=>f.kind==='checkout').sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  const ownedCounters=new Set([...placed,...stored].filter(f=>f.kind==='checkout').map(f=>f.id));
  const seen=new Set();
  let employees;
  if(Array.isArray(saved.employees)){
    employees=saved.employees.filter(employee=>employee&&typeof employee.id==='string'&&!seen.has(employee.id)&&seen.add(employee.id))
      .map(employee=>({...employee,role:employee.role==='restock'?'restock':'checkout',
        registerId:ownedCounters.has(employee.registerId)?employee.registerId:null,
        skills:{checkout:Math.min(EMPLOYEE_SKILL_LIMIT,count(employee.skills?.checkout)),restock:Math.min(EMPLOYEE_SKILL_LIMIT,count(employee.skills?.restock))},
        workSeconds:Number.isFinite(employee.workSeconds)?Math.max(0,employee.workSeconds):0}));
  }else{
    const cashiers=Number.isFinite(saved.cashierCount)?count(saved.cashierCount):1;
    employees=Array.from({length:cashiers},(_,index)=>({id:`legacy-cashier-${index+1}`,role:'checkout',registerId:counters[index]?.id||null,skills:{checkout:0,restock:0},workSeconds:0}));
    if(saved.helper)employees.push({id:'legacy-restocker',role:'restock',registerId:null,skills:{checkout:0,restock:0},workSeconds:0});
  }
  const assigned=new Set();
  for(const employee of employees){
    if(employee.role!=='checkout'){employee.registerId=null;continue;}
    if(employee.registerId&&assigned.has(employee.registerId))employee.registerId=null;
    if(!employee.registerId)employee.registerId=counters.find(counter=>!assigned.has(counter.id))?.id||null;
    if(employee.registerId)assigned.add(employee.registerId);
  }
  return employees;
}

export function hireStoreEmployee(state,role,registerId=null){
  if(!['checkout','restock'].includes(role))return {ok:false,reason:'role',state};
  const employees=migrateEmployees(state,state.fixtures||[],state.warehouse||[]);
  const occupied=new Set(employees.filter(e=>e.role==='checkout').map(e=>e.registerId));
  const register=(state.fixtures||[]).find(f=>f.kind==='checkout'&&(!registerId||f.id===registerId)&&!occupied.has(f.id));
  if(role==='checkout'&&!register)return {ok:false,reason:'vacancy',state};
  const purchase=spendCash(state,EMPLOYEE_HIRE_COST,'employee',{detail:role});
  if(!purchase.ok)return {...purchase,reason:'cash'};
  const sequence=count(state.nextEmployeeSequence)+1;
  let id=`employee-${sequence}`;while(employees.some(e=>e.id===id))id+='-new';
  const employee={id,role,registerId:role==='checkout'?register.id:null,skills:{checkout:0,restock:0},workSeconds:0};
  employees.push(employee);
  return {ok:true,employee,state:{...purchase.state,employees,nextEmployeeSequence:sequence,cashierCount:employees.filter(e=>e.role==='checkout').length,helper:state.helper||role==='restock'}};
}

export function changeEmployeeRole(state,employeeId,role,registerId=null){
  if(!['checkout','restock'].includes(role))return {ok:false,reason:'role',state};
  const employees=migrateEmployees(state,state.fixtures||[],state.warehouse||[]);
  const employee=employees.find(e=>e.id===employeeId);if(!employee)return {ok:false,reason:'employee',state};
  const occupied=new Set(employees.filter(e=>e.id!==employeeId&&e.role==='checkout').map(e=>e.registerId));
  const register=(state.fixtures||[]).find(f=>f.kind==='checkout'&&(!registerId||f.id===registerId)&&!occupied.has(f.id));
  if(role==='checkout'&&!register)return {ok:false,reason:'vacancy',state};
  employee.role=role;employee.registerId=role==='checkout'?register.id:null;employee.workSeconds=0;
  delete employee.work;
  return {ok:true,state:{...state,employees,cashierCount:employees.filter(e=>e.role==='checkout').length,helper:state.helper||role==='restock'}};
}

export function upgradeEmployeeSkill(state,employeeId,skill){
  const employees=migrateEmployees(state,state.fixtures||[],state.warehouse||[]);
  const employee=employees.find(e=>e.id===employeeId);if(!employee)return {ok:false,reason:'employee',state};
  const cost=employeeSkillCost(skill,employee.skills[skill]);if(!cost)return {ok:false,reason:'max',state};
  const purchase=spendCash(state,cost,'staffSkill',{detail:skill});if(!purchase.ok)return {...purchase,reason:'cash'};
  employee.skills[skill]++;return {ok:true,state:{...purchase.state,employees}};
}

function count(value){return Number.isFinite(value)?Math.max(0,Math.floor(value)):0}

export function migrateEquipmentState(saved={}){
  const hasEquipment=saved.equipment&&typeof saved.equipment==='object'&&!Array.isArray(saved.equipment);
  const legacyUpgradeCredits=hasEquipment
    ? Math.min(2,count(saved.legacyUpgradeCredits))
    : Math.min(2,count(saved.upgrades));
  return {
    equipment:{cooler:Boolean(hasEquipment&&saved.equipment.cooler),fastCheckout:Boolean(hasEquipment&&saved.equipment.fastCheckout)},
    legacyUpgradeCredits
  };
}

export function stockCapacity(equipment={}){
  return BASE_STOCK_CAPACITY+(equipment.cooler?COOLER_STOCK_BONUS:0)+Math.min(8,count(equipment.doubleShelves))*20+Math.min(5,count(equipment.storageLevel))*20;
}

export function totalStock(stock={}){
  return Object.values(stock).reduce((sum,value)=>sum+count(value),0);
}

export function appendCashLedger(state,entry={}){
  const amount=Number.isFinite(entry.amount)?Math.trunc(entry.amount):0;
  const debtChange=Number.isFinite(entry.debtChange)?Math.trunc(entry.debtChange):0;
  const row={
    kind:String(entry.kind||'activity'),
    amount,
    debtChange,
    balance:Number.isFinite(state.cash)?Math.floor(state.cash):0,
    day:count(state.day),
    ...(entry.product?{product:String(entry.product)}:{}),
    ...(entry.quantity?{quantity:count(entry.quantity)}:{}),
    ...(entry.detail?{detail:String(entry.detail)}:{})
  };
  return {...state,cashLedger:[...(Array.isArray(state.cashLedger)?state.cashLedger:[]),row].slice(-CASH_LEDGER_LIMIT)};
}

export function spendCash(state,amount,kind,details={}){
  const cost=count(amount);
  if(!cost)return {ok:false,reason:'amount',state};
  if(!Number.isFinite(state.cash)||state.cash<cost)return {ok:false,reason:'cash',state};
  const next={...state,cash:state.cash-cost};
  return {ok:true,charged:cost,state:appendCashLedger(next,{...details,kind,amount:-cost})};
}

export function restockOffer(stock,equipment,requestedQuantity,unitCost){
  const quantity=Math.min(count(requestedQuantity),Math.max(0,stockCapacity(equipment)-totalStock(stock)));
  return {quantity,cost:quantity*unitCost};
}

export function affordableRestockOffer(stock,equipment,requestedQuantity,unitCost,cash=Infinity){
  const room=Math.max(0,stockCapacity(equipment)-totalStock(stock));
  const availableCash=Number.isFinite(cash)?Math.max(0,cash):Infinity;
  const affordable=unitCost>0?Math.floor(availableCash/unitCost):count(requestedQuantity);
  const quantity=Math.min(count(requestedQuantity),room,affordable);
  return {quantity,cost:quantity*unitCost};
}

export function customerBudget(random=Math.random){
  const segment=Math.max(0,Math.min(.999999,random()));
  const [minimum,maximum]=segment<.3?[10,24]:segment<.6?[8,28]:segment<.85?[24,70]:[35,90];
  return Math.floor(minimum+Math.max(0,Math.min(.999999,random()))*(maximum-minimum+1));
}

export function recoveryShipment(state,unitCost=8,quantity=RECOVERY_WATER_QUANTITY,deliveryFee=RECOVERY_DELIVERY_FEE){
  const orders=count(state.recoveryOrders);
  if(!Number.isFinite(state.cash)||state.cash>=unitCost||totalStock(state.stock)>0||orders>=RECOVERY_ORDER_LIMIT)return {ok:false,state};
  const cost=quantity*unitCost+deliveryFee;
  return {ok:true,quantity,cost,state:{...state,stock:{...state.stock,water:count(state.stock?.water)+quantity},recoveryOrders:orders+1,recoveryDebt:count(state.recoveryDebt)+cost}};
}

export function applySaleRevenue(state,grossRevenue){
  const gross=count(grossRevenue),debtPayment=Math.min(count(state.recoveryDebt),gross),netRevenue=gross-debtPayment;
  return {state:{...state,cash:(Number.isFinite(state.cash)?Math.max(0,state.cash):0)+netRevenue,recoveryDebt:count(state.recoveryDebt)-debtPayment},grossRevenue:gross,netRevenue,debtPayment};
}

export function browseSeconds(equipment={}){
  return equipment.cooler?COOLER_BROWSE_SECONDS:BASE_BROWSE_SECONDS;
}

export function checkoutSeconds(equipment={}){
  return equipment.fastCheckout?FAST_CHECKOUT_SECONDS:BASE_CHECKOUT_SECONDS;
}

export function purchaseEquipment(state,key,cost){
  if(!['cooler','fastCheckout'].includes(key))return {ok:false,reason:'unknown-equipment',state};
  if(state.equipment?.[key])return {ok:false,reason:'owned',state};
  const legacyUpgradeCredits=count(state.legacyUpgradeCredits);
  const usesLegacyCredit=legacyUpgradeCredits>0;
  if(!usesLegacyCredit&&state.cash<cost)return {ok:false,reason:'cash',state};
  const next={
      ...state,
      cash:state.cash-(usesLegacyCredit?0:cost),
      upgrades:count(state.upgrades)+1,
      legacyUpgradeCredits:legacyUpgradeCredits-(usesLegacyCredit?1:0),
      equipment:{...state.equipment,[key]:true}
    };
  return {
    ok:true,
    usesLegacyCredit,
    charged:usesLegacyCredit?0:cost,
    state:appendCashLedger(next,{kind:'equipment',amount:usesLegacyCredit?0:-cost,detail:key})
  };
}
