const labels=Object.freeze({en:'Pairs left','zh-Hant':'剩餘配對','zh-Hans':'剩余配对',ja:'残りのペア',ko:'남은 쌍',es:'Parejas restantes','pt-BR':'Pares restantes',fr:'Paires restantes',de:'Verbleibende Paare',it:'Coppie rimaste',ru:'Осталось пар',hi:'बाकी जोड़ियाँ',ar:'الأزواج المتبقية'});
export function campaignPairProgress(board,locale){
 if(!labels[locale])throw new Error('Unsupported campaign progress locale');
 const total=board.tiles.length/2,left=(board.tiles.length-board.removed.length)/2;
 return {total,left,label:labels[locale],text:`${labels[locale]}: ${left} / ${total}`};
}
