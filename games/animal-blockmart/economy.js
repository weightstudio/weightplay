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
  return BASE_STOCK_CAPACITY+(equipment.cooler?COOLER_STOCK_BONUS:0);
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
