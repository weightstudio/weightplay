const copy={
  en:{targets:'Targets',seals:'Seals',order:'Order',goalTargets:'Defeat every required target before taking the crown.',goalSeals:'Collect every seal in order before taking the crown.',goalBoth:'Defeat required targets and collect seals in order before the crown.',goalCrown:'Reach the crown to win.'},
  'zh-Hant':{targets:'指定目標',seals:'封印',order:'順序',goalTargets:'先擊敗所有指定目標，才能拿皇冠。',goalSeals:'依序收集所有封印，才能拿皇冠。',goalBoth:'先擊敗指定目標，再依序收集封印，才能拿皇冠。',goalCrown:'抵達皇冠即可獲勝。'},
  'zh-Hans':{targets:'指定目标',seals:'封印',order:'顺序',goalTargets:'先击败所有指定目标，才能拿皇冠。',goalSeals:'按顺序收集所有封印，才能拿皇冠。',goalBoth:'先击败指定目标，再按顺序收集封印，才能拿皇冠。',goalCrown:'抵达皇冠即可获胜。'},
  ja:{targets:'必須目標',seals:'封印',order:'順番',goalTargets:'王冠を取る前に、必須目標をすべて倒そう。',goalSeals:'王冠を取る前に、封印を順番に集めよう。',goalBoth:'必須目標を倒し、封印を順番に集めてから王冠へ。',goalCrown:'王冠に着けばクリア。'},
  ko:{targets:'필수 목표',seals:'봉인',order:'순서',goalTargets:'왕관을 얻기 전에 필수 목표를 모두 쓰러뜨리세요.',goalSeals:'왕관을 얻기 전에 봉인을 순서대로 모으세요.',goalBoth:'필수 목표를 처치하고 봉인을 순서대로 모은 뒤 왕관을 차지하세요.',goalCrown:'왕관에 도착하면 승리합니다.'},
  es:{targets:'Objetivos',seals:'Sellos',order:'Orden',goalTargets:'Vence todos los objetivos obligatorios antes de tomar la corona.',goalSeals:'Recoge todos los sellos en orden antes de tomar la corona.',goalBoth:'Vence los objetivos y recoge los sellos en orden antes de la corona.',goalCrown:'Llega a la corona para ganar.'},
  'pt-BR':{targets:'Alvos',seals:'Selos',order:'Ordem',goalTargets:'Derrote todos os alvos obrigatórios antes de pegar a coroa.',goalSeals:'Pegue todos os selos em ordem antes da coroa.',goalBoth:'Derrote os alvos e pegue os selos em ordem antes da coroa.',goalCrown:'Chegue à coroa para vencer.'},
  fr:{targets:'Cibles',seals:'Sceaux',order:'Ordre',goalTargets:'Battez toutes les cibles requises avant la couronne.',goalSeals:'Collectez les sceaux dans l’ordre avant la couronne.',goalBoth:'Battez les cibles et prenez les sceaux dans l’ordre avant la couronne.',goalCrown:'Atteignez la couronne pour gagner.'},
  de:{targets:'Ziele',seals:'Siegel',order:'Reihenfolge',goalTargets:'Besiege alle Pflichtziele vor der Krone.',goalSeals:'Sammle alle Siegel der Reihe nach vor der Krone.',goalBoth:'Besiege die Pflichtziele und sammle die Siegel der Reihe nach vor der Krone.',goalCrown:'Erreiche die Krone zum Sieg.'},
  it:{targets:'Obiettivi',seals:'Sigilli',order:'Ordine',goalTargets:'Sconfiggi tutti gli obiettivi richiesti prima della corona.',goalSeals:'Raccogli i sigilli in ordine prima della corona.',goalBoth:'Sconfiggi gli obiettivi e raccogli i sigilli in ordine prima della corona.',goalCrown:'Raggiungi la corona per vincere.'},
  ru:{targets:'Цели',seals:'Печати',order:'Порядок',goalTargets:'Победите все обязательные цели до получения короны.',goalSeals:'Соберите все печати по порядку до получения короны.',goalBoth:'Победите обязательные цели и соберите печати по порядку до короны.',goalCrown:'Дойдите до короны, чтобы победить.'},
  hi:{targets:'ज़रूरी लक्ष्य',seals:'मुहरें',order:'क्रम',goalTargets:'मुकुट लेने से पहले सभी ज़रूरी लक्ष्यों को हराएँ।',goalSeals:'मुकुट लेने से पहले सभी मुहरें क्रम से लें।',goalBoth:'ज़रूरी लक्ष्यों को हराएँ और मुहरें क्रम से लेकर फिर मुकुट तक पहुँचें।',goalCrown:'मुकुट तक पहुँचकर जीतें।'},
  ar:{targets:'الأهداف',seals:'الأختام',order:'الترتيب',goalTargets:'اهزم كل الأهداف المطلوبة قبل أخذ التاج.',goalSeals:'اجمع كل الأختام بالترتيب قبل أخذ التاج.',goalBoth:'اهزم الأهداف المطلوبة واجمع الأختام بالترتيب قبل التاج.',goalCrown:'صل إلى التاج لتفوز.'}
};

export function battleObjective(locale,state){
  const words=copy[locale]||copy.en;
  const targetIds=new Set([...(state.required||[]),...(state.enemies||[]).filter(enemy=>enemy.boss).map(enemy=>enemy.id)]);
  const targetCount=targetIds.size;
  const sealOrder=state.sealOrder||[];
  const goal=targetCount&&sealOrder.length?words.goalBoth:targetCount?words.goalTargets:sealOrder.length?words.goalSeals:words.goalCrown;
  const progress=[];
  if(targetCount){const defeated=[...targetIds].filter(id=>(state.killed||[]).includes(id)).length;progress.push(`${words.targets} ${defeated}/${targetCount}`);}
  if(sealOrder.length){progress.push(`${words.seals} ${(state.seals||[]).length}/${sealOrder.length}`,`${words.order} ${sealOrder.join('→')}`);}
  return {goal,progress:progress.join(' · ')};
}
