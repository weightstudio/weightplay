import { STATIONS } from './core.mjs?wp-media=ad19a5c18bce29d5';

// Required observation windows. One lowercase letter means the last site sees glare.
// An isolated dot reserves the recommended round for a recharge.
const setups = [
  ['EA VB', 'AS BS', 3, 4],
  ['VA WB', 'AS BS', 3, 4],
  ['WA EC', 'AS CS', 3, 4],
  ['WB EA VC', 'BS AS CS', 4, 5],
  ['EA VC WB', 'AS CS BS', 4, 5],
  ['EA VB WA', 'AX BS', 4, 4],
  ['VA WC EA', 'AX CS', 4, 4],
  ['VB EA WA', 'BS AX', 4, 4],
  ['WA VB EA', 'AX BS', 4, 4],
  ['VA EB Wa', 'AX BS', 5, 4],
  ['EA Va WC', 'AX CS', 5, 4],
  ['WB . EA VA', 'BS AX', 3, 5],
  ['VA WB EA VB', 'AX BX', 5, 5],
  ['EA Wb . VA', 'AX BS', 4, 5],
  ['EA . Vb WA EB', 'AX BX', 5, 6],
  ['VA WB EA', 'AX BS', 4, 4],
  ['EA . WA VC', 'AX CS', 3, 5],
  ['WB EC VB WA', 'BX CS AS', 5, 5],
  ['VA EB WC WA VB', 'AX BX CS', 6, 6],
  ['EB VC . VA WC WB', 'BX CX AS', 5, 7],
  ['EA Wb VA', 'AX BS', 5, 4],
  ['VA . WC EA', 'AX CS', 3, 5],
  ['EB VA WB EC WA', 'BX AX CS', 6, 6],
  ['WA Eb . VA WB EC', 'AX BX CS', 6, 7],
  ['VA WB . Ea VB WC', 'AX BX CS', 6, 7],
  ['WC VA EC . WA', 'CX AX', 4, 6],
  ['VA Wb WA Eb VC', 'AX BX CS', 8, 6],
  ['EB VA . WB EC WA VC', 'BX AX CX', 6, 8],
  ['WA VB Ec . VA WB WC', 'AX BX CX', 7, 8],
  ['VA Wb EC . EA VB WC', 'AX BX CX', 7, 8],
  ['EVA', 'AZ', 3, 3],
  ['VWA EB', 'AZ BS', 4, 4],
  ['WB EWA', 'BS AZ', 4, 4],
  ['EVA WB VWC', 'AZ BS CZ', 6, 5],
  ['EVa . WB', 'AZ BS', 4, 5],
  ['WA EVB VA', 'AX BZ', 5, 5],
  ['VWA EB EVC', 'AZ BS CZ', 6, 5],
  ['EA . VWB WA', 'AX BZ', 4, 6],
  ['EVA Wc EVB VC', 'AZ CX BZ', 8, 6],
  ['EWB . VWa EC', 'BZ AZ CS', 6, 6],
  ['EVa WB EC', 'AZ BS CS', 6, 5],
  ['WA EVB . VA EWC', 'AX BZ CZ', 6, 7],
  ['EVB WA VWC EA', 'BZ AX CZ', 7, 6],
  ['EB VWa . WB EC', 'BX AZ CS', 6, 7],
  ['EVA WB . EWC VB', 'AZ BX CZ', 6, 7],
  ['EA VWB WA EVC', 'AX BZ CZ', 7, 6],
  ['EWa VC EVB WC', 'AZ CX BZ', 8, 6],
  ['EVA VWB EWC', 'AZ BZ CZ', 7, 5],
  ['VA EWB . WA EVc', 'AX BZ CZ', 7, 7],
  ['VWA EC EVB . WC', 'AZ CX BZ', 8, 7],
  ['EVA WB . VB EWc', 'AZ BX CZ', 7, 7],
  ['VWB EA EWC WA', 'BZ AX CZ', 7, 6],
  ['EVa WC EWB EC', 'AZ CX BZ', 8, 6],
  ['VA EWB . EA VWC', 'AX BZ CZ', 6, 7],
  ['VWa EB EVc WB', 'AZ BX CZ', 9, 6],
  ['EWA VB EVC WB', 'AZ BX CZ', 7, 6],
  ['EA EVb . WA VWC', 'AX BZ CZ', 7, 7],
  ['EVA VWB . WC EC', 'AZ BZ CX', 6, 7],
  ['VA EVb . WA . EVC', 'AX BZ CZ', 8, 8],
  ['EVa WB . VWC EB', 'AZ BX CZ', 7, 7],
];

function defineNight([backbone, targets, energy, rounds], index) {
  const id = index + 1;
  const turns = backbone.split(' ');
  const goals = Object.fromEntries(targets.split(' ').map(code => [code[0], code[1]]));
  const signals = Object.keys(goals);
  let spare = energy;

  const windows = Array.from({ length: rounds }, (_, turn) => {
    const command = turns[turn] ?? '';
    const signal = command.at(-1)?.toUpperCase();
    const sites = command === '.' ? [] : command.slice(0, -1).split('');
    const hasGlare = sites.length > 0 && signal !== command.at(-1);
    if (command === '.') spare += 1;
    else if (sites.length) spare -= sites.length + Number(hasGlare);
    const inaccessible = (index + turn * 2) % 3;
    return Object.fromEntries(STATIONS.map((site, station) => {
      const position = sites.indexOf(site);
      if (position >= 0) return [site, { signal, weather: hasGlare && position === sites.length - 1 ? 'glare' : 'clear' }];
      if (id === 1 && turn === 0) return [site, { signal: site === 'W' ? 'B' : 'A', weather: 'clear' }];
      let alternate = signals[(index + turn + station * 2) % signals.length];
      if (goals[alternate] === 'Z' && command !== '') alternate = signals.find(key => goals[key] !== 'Z') ?? alternate;
      let weather = 'clear';
      if (id >= 16 && station === inaccessible) weather = 'cloud';
      else if (id >= 11 && station === (inaccessible + 1) % 3) weather = 'glare';
      if (goals[alternate] === 'Z' && command !== '' && sites.length > 0) weather = 'cloud';
      if (id === 7 && turn === rounds - 1 && site === 'V') return [site, { signal: 'A', weather: 'clear' }];
      if (id === 41 && turn === rounds - 1 && site !== 'W') return [site, { signal: 'A', weather: 'clear' }];
      return [site, { signal: alternate, weather }];
    }));
  });

  return { id, goals, energy, capacity: energy + 1, gold: Math.max(1, spare), windows };
}

export const LEVELS = setups.map(defineNight);
export const WITNESSES = setups.map(([backbone]) => backbone.split(' '));
