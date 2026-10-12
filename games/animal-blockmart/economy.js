export const BASE_STOCK_CAPACITY=40;
export const COOLER_STOCK_BONUS=30;
export const BASE_BROWSE_SECONDS=.27;
export const COOLER_BROWSE_SECONDS=.12;
export const BASE_CHECKOUT_SECONDS=1.4;
export const FAST_CHECKOUT_SECONDS=.7;

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

export function restockOffer(stock,equipment,requestedQuantity,unitCost){
  const quantity=Math.min(count(requestedQuantity),Math.max(0,stockCapacity(equipment)-totalStock(stock)));
  return {quantity,cost:quantity*unitCost};
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
  return {
    ok:true,
    usesLegacyCredit,
    charged:usesLegacyCredit?0:cost,
    state:{
      ...state,
      cash:state.cash-(usesLegacyCredit?0:cost),
      upgrades:count(state.upgrades)+1,
      legacyUpgradeCredits:legacyUpgradeCredits-(usesLegacyCredit?1:0),
      equipment:{...state.equipment,[key]:true}
    }
  };
}
