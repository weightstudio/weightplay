import { normalizeOrder } from './model.mjs?wp-media=e8a8ea693c11ca7b';

// Each row is a five-stage district. The last job in each district is a checkpoint.
const districts = [
  ['L B', 'K', 'S', 'P', 'B L'],
  ['GL', 'DK', 'GP', 'DB GS', 'GK DL'],
  ['DP', 'RS', 'RL DB', 'GB RP', 'RK GL DS'],
  ['G1K', 'D2P', 'R2B', 'G2S D1P', 'R1L G2K D2S'],
  ['GWL', 'RHP', 'GHK DWL', 'DHB RWS', 'GWP DHK RHB'],
  ['G2WS D1HL', 'R2HK G1WP', 'D1WB R2HL', 'R1WP D2WS', 'G2HB R1WK D2HP'],
  ['>GL', '>DS', '>RK', '>GP DB', '>DL RP GS'],
  ['>G2K', '>D1P G2L', '>R2S', '>R1K D2B', '>D2L R1S G2P'],
  ['<G1B', '<R2K', '<R1S G2K', '<D2P G1L', '<D1S R2L G1B'],
  ['>GWS', '<RHL', '>DWK GHB', '<RWP DHK', '>GHP RWB DHL'],
  ['<D2WB R1HS', '>R1HL G2WP', '<G1HS D2WL', '>D1WP R2HK', '<R2HB D1WL G2HS'],
  ['>D2HK G1WS R1HL', '<D1WP G2HK R2WB', '~R1WS D2HP G1WB', '~G2WL R2HK D1HS', '~D2HB G1WP R2HL'],
];

export const stages = districts.flatMap((jobs,district)=>jobs.map((job,i)=>{
  const number = district*5+i+1;
  const direction = job[0];
  const sentences = (['<','>','~'].includes(direction) ? job.slice(1) : job).split(' ');
  const orders = sentences.map((text,index)=>{
    const eastward = direction === '>' || (direction === '~' && index % 2 === 0);
    return {
      order:normalizeOrder(text),
      source: number <= 30 ? null : eastward ? 'A' : 'B',
      target: eastward ? 'B' : 'A',
    };
  });
  return {number, district, chapter:Number(number > 30), checkpoint:i === 4, orders};
}));
