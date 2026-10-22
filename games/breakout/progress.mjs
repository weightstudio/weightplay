export function purchaseAurora({read,write,wallet}) {
  const previous=read();if(previous.aurora)return {ok:true,save:previous,charged:0};
  if(!wallet)return {ok:false,reason:'wallet'};
  const next={...previous,aurora:true,finish:'aurora'};
  try{write(previous);}catch{return {ok:false,reason:'save'};}
  let spent=false;
  try {spent=wallet.spendDiamonds(15);if(!spent)return {ok:false,reason:'funds'};write(next);return {ok:true,save:next,charged:15};}
  catch(error){if(spent)wallet.addDiamonds(15);return {ok:false,reason:'save'};}
}
