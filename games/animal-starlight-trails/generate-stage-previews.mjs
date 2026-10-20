import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "stage-previews");
const templates = [
  { p:[[14,58],[38,30],[63,58],[86,27]], r:[0,1,2,3] },
  { p:[[22,26],[76,26],[76,74],[22,74]], r:[0,1,2,3,0] },
  { p:[[20,68],[80,68],[76,30],[24,30],[50,10]], r:[0,1,2,3,0,4,1] },
  { p:[[15,50],[50,16],[85,50],[50,84],[50,50]], r:[0,1,2,3,0,4,2] },
  { p:[[13,26],[44,14],[77,28],[68,72],[34,82],[50,50]], r:[0,1,2,3,4,1,3,5] },
  { p:[[14,24],[50,10],[84,25],[78,70],[24,74],[50,48]], r:[0,1,2,3,0,4,2,5,0] },
  { p:[[12,54],[28,18],[63,12],[87,42],[70,82],[26,84],[50,50]], r:[0,1,2,3,4,0,5,2,6,4] },
  { p:[[18,20],[52,10],[84,24],[82,70],[48,88],[16,68],[50,48]], r:[0,1,2,3,0,4,1,5,2,6,3] },
  { p:[[12,36],[35,10],[68,12],[88,40],[73,79],[38,88],[48,48],[18,70]], r:[0,1,2,3,4,0,5,2,6,4,7,1] },
  { p:[[15,22],[50,8],[84,24],[88,66],[54,88],[18,78],[48,44],[70,58]], r:[0,1,2,3,0,4,1,5,2,6,3,7,0] },
];

function stage(id) {
  const chapter = Math.ceil(id / 5);
  const templateIndex = chapter === 1 ? id - 1 : Math.min(9, chapter + ((id - 1) % 5) - 1);
  const template = templates[templateIndex];
  const points = template.p.map(([x,y]) => {
    let nx = id % 2 === 0 ? 100 - x : x, ny = y;
    if (id % 3 === 0) [nx,ny] = [ny,100-nx];
    return [nx,ny];
  });
  const route = template.r;
  const edges = route.slice(0, -1).map((from, index) => [from, route[index + 1]]);
  return { points, edges };
}

function svgFor({ points, edges }) {
  const lines = edges.map(([from,to]) => {
    const [x1,y1] = points[from], [x2,y2] = points[to];
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join("");
  const nodes = points.map(([x,y]) => `<rect x="${x-2.5}" y="${y-2.5}" width="5" height="5"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" role="img" aria-label="Constellation preview">
  <defs><radialGradient id="night"><stop stop-color="#28546c" stop-opacity=".72"/><stop offset="1" stop-color="#071625" stop-opacity=".08"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="1.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <rect width="100" height="125" fill="#071625"/><ellipse cx="50" cy="58" rx="46" ry="51" fill="url(#night)"/>
  <g transform="translate(16 17) scale(.68)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="#76eced" stroke-opacity=".3" stroke-width="5" filter="url(#glow)">${lines}</g>
    <g stroke="#b1f8ed" stroke-width="1.25">${lines}</g>
    <g fill="#ffe4a5" stroke="#fff6d1" stroke-width=".7" filter="url(#glow)">${nodes}</g>
  </g>
  <g fill="#d6f9ff" opacity=".55"><circle cx="13" cy="17" r=".8"/><circle cx="83" cy="24" r=".6"/><circle cx="91" cy="88" r=".8"/><circle cx="11" cy="98" r=".5"/><circle cx="28" cy="113" r=".7"/><circle cx="75" cy="107" r=".5"/></g>
</svg>
`;
}

fs.mkdirSync(output, { recursive: true });
for (let id = 1; id <= 30; id += 1) {
  const filename = `stage-${String(id).padStart(2, "0")}.svg`;
  fs.writeFileSync(path.join(output, filename), svgFor(stage(id)));
}
console.log(`Generated 30 constellation previews in ${path.relative(process.cwd(), output)}.`);
