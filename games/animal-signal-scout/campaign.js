/* Authored signal routes. Digits are fox/owl/rabbit; x marks a sleeping post.
   Never generate completion from an array index: the player submits the code. */
window.SIGNAL_CAMPAIGN = [
  ['forward','010'],['forward','201'],['forward','1120'],['forward','2021'],['reverse','01210'],
  ['reverse','012'],['reverse','2010'],['reverse','1120'],['reverse','0201'],['reverse-skip','2x1002'],
  ['skip','0x12'],['skip','21x0'],['skip','x1021'],['skip','20x12'],['rotate-skip','1x20x1'],
  ['memory','012'],['memory','2010'],['memory','1021'],['memory','2201'],['memory-reverse','01220'],
  ['rotate','012'],['rotate','2010'],['rotate','1120'],['rotate','2021'],['memory-rotate','21002'],
  ['reverse-skip','0x12'],['memory-reverse','2010'],['rotate-skip','1x020'],['memory-skip','21x01'],['finale','01x220']
].map(([rule, pattern], index) => {
  let order = [...pattern].filter(v => v !== 'x').map(Number);
  if (rule.includes('reverse') || rule === 'finale') order.reverse();
  if (rule.includes('rotate')) order.push(order.shift());
  return { number:index+1, chapter:Math.floor(index/5), checkpoint:(index+1)%5===0,
    rule, pattern, order, memory:rule.includes('memory') || rule==='finale' };
});
