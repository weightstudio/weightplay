// Authored terrain and solution witnesses. Row 1 is the far edge of the diorama.
const definitions = [
  ['A place to call home','第一個家', ['##S##','#...#','#.*.#','#...#','#####'], {bed:1,pantry:1,food:1}, 8,5, 'C2:bed C3:pantry'],
  ['Room for two','兩人的小窩', ['..S..','.....','.*...','##.##','#####'], {bed:2,pantry:1,food:2}, 11,9, 'C2:pantry B2:bed D2:bed B3:hall'],
  ['Around the corner','轉角的暖光', ['S#...','.#...','.*...','.....','#####'], {bed:1,pantry:1,food:1}, 9,6, 'A2:bed A3:pantry B3:hall'],
  ['The long hallway','長廊上的家', ['##S##','##.##','#...#','#.*.#','#####'], {bed:2,pantry:1,food:2}, 12,10, 'C2:hall C3:pantry B3:bed D3:bed C4:hall'],
  ['A shared table','一起吃晚餐', ['.....','..*..','S....','.....','#####'], {bed:3,pantry:1,food:3}, 15,12, 'B3:bed C3:pantry C2:bed D3:bed'],
  ['Stone door','岩石之門', ['S#...','.#.#.','.*.#.','##...','#####'], {bed:2,pantry:1,food:2}, 13,9, 'A2:hall A3:bed B3:pantry C3:bed'],
  ['Split passage','分岔小徑', ['..S..','..#..','..#..','..*..','#####'], {bed:2,pantry:1,food:2}, 15,12, 'B1:hall B2:hall B3:bed B4:pantry A4:bed C4:hall'],
  ['Hidden alcove','祕密壁龕', ['####S','#....','#.##.','#.*..','#####'], {bed:2,pantry:1,food:2}, 16,12, 'E2:hall D2:bed C2:pantry B2:bed B3:hall B4:hall C4:hall'],
  ['Heart of the hill','山丘之心', ['..#..','..#..','S.#.*','..#..','.....'], {bed:2,pantry:1,food:2}, 20,16, 'B3:bed B4:pantry A4:bed B5:hall C5:hall D5:hall E5:hall E4:hall E3:hall'],
  ['The great hollow','大樹洞', ['##S##','#...#','.#.#.','.*...','#####'], {bed:3,pantry:2,food:3}, 20,16, 'C2:pantry B2:bed D2:bed C3:hall C4:pantry B4:bed D4:hall'],
  ['First sprouts','第一株嫩芽', ['..S..','.....','..~..','..*..','#####'], {bed:1,pantry:1,food:1,garden:1}, 12,10, 'C2:bed B2:pantry B3:garden B4:hall C4:hall'],
  ['Spring picnic','泉邊野餐', ['..S..','.....','~...~','.*...','#####'], {bed:2,pantry:1,food:2,garden:1}, 15,12, 'C2:pantry B2:bed D2:bed A2:garden B3:hall B4:hall'],
  ['Two little gardens','兩座小花圃', ['S....','.....','~.*.~','.....','#####'], {bed:1,pantry:1,food:1,garden:2}, 18,13, 'A2:garden B2:bed C2:pantry D2:hall E2:garden C3:hall'],
  ['The moss terrace','青苔露臺', ['##S##','#...#','~...~','..*..','#####'], {bed:2,pantry:1,food:2,garden:2}, 17,14, 'C2:pantry B2:bed D2:bed B3:garden D3:garden C3:hall C4:hall'],
  ['A living courtyard','生機庭院', ['..S..','.....','.~~~.','..*..','.....'], {bed:3,pantry:1,food:3,garden:2}, 26,22, 'C2:pantry B2:bed D2:bed B1:pantry A1:bed A2:hall E2:hall A3:garden E3:garden A4:hall B4:hall C4:hall'],
  ['Over the stream','跨過小溪', ['##S##','#...#','~~~~~','#.*.#','#####'], {bed:1,pantry:1,food:1,garden:1}, 13,10, 'C2:hall C3:bridge C4:pantry B4:bed D4:garden'],
  ['Island home','小島之家', ['S.~..','..~..','..~*.','..~..','#####'], {bed:2,pantry:1,food:2,garden:1}, 18,14, 'B1:hall B2:garden C2:bridge D2:pantry D1:bed E2:bed D3:hall'],
  ['Twin banks','雙岸相連', ['..S..','~~~~~','..*..','~~~~~','.....'], {bed:2,pantry:1,food:2,garden:2}, 20,15, 'C2:bridge C3:pantry B3:bed D3:bed A3:garden E3:garden'],
  ['The water bend','溪流的彎道', ['S....','.~~..','..~..','.*~..','..~..'], {bed:2,pantry:1,food:2,garden:2}, 21,15, 'A2:garden A3:bed B3:pantry B4:bed C3:bridge D3:garden'],
  ['River village','河畔小村', ['..S..','..~..','~~~~~','..*..','.....'], {bed:3,pantry:1,food:3,garden:2}, 25,22, 'B1:hall B2:garden B3:bridge B4:bed C4:pantry D4:bed C5:bed D3:bridge E3:bridge E4:garden'],
  ['New neighbours','新鄰居', ['..S..','.....','..*..','.....','#####'], {bed:1,pantry:1,food:1,nursery:1}, 12,8, 'C2:bed B2:pantry C3:nursery'],
  ['The nursery nook','育幼小角落', ['S#...','.#...','.*...','.....','#####'], {bed:2,pantry:1,food:2,nursery:1}, 16,12, 'A2:hall A3:bed B3:pantry C3:bed C2:nursery'],
  ['Garden playtime','花園遊戲日', ['..S..','.....','~.*.~','.....','#####'], {bed:2,pantry:1,food:2,garden:1,nursery:1}, 18,14, 'C2:pantry B2:bed D2:bed B3:nursery A2:garden C3:hall'],
  ['Across to school','過橋上學', ['S....','~~~~~','..*..','.....','#####'], {bed:2,pantry:1,food:2,garden:1,nursery:2}, 23,20, 'A2:bridge A3:garden B3:bed C3:pantry D3:bed B4:nursery D4:nursery'],
  ['A growing family','茁壯的家族', ['..S..','.....','.~.~.','..*..','.....'], {bed:3,pantry:1,food:3,garden:2,nursery:1}, 27,23, 'C2:pantry B2:bed D2:bed A2:hall A3:garden E2:hall E3:garden C3:hall C4:bed C5:pantry D4:nursery'],
  ['Lantern canyon','燈火峽谷', ['S#...','.#.~.','..~..','.*~..','.....'], {bed:2,pantry:1,food:2,garden:2,nursery:1}, 27,23, 'A2:hall A3:bed B3:pantry B4:bed A4:nursery C3:bridge D3:garden C4:bridge D4:hall E4:hall E3:hall E2:garden'],
  ['Secret river','祕密地下河', ['..S..','.~~~.','.....','~.*.~','.....'], {bed:3,pantry:1,food:3,garden:2,nursery:1}, 25,21, 'C2:bridge C3:pantry B3:bed D3:bed C4:bed B4:nursery A3:garden E3:garden'],
  ['Many little windows','好多小窗', ['S#...','.#.#.','...#.','.#.*.','.....'], {bed:3,pantry:2,food:3,nursery:2}, 28,24, 'A2:hall A3:bed B3:pantry C3:bed C2:nursery C4:pantry D4:bed D5:nursery A4:hall A5:hall'],
  ['The woodland lodge','森林大宅', ['..S..','.....','~.#.~','.*~..','.....'], {bed:3,pantry:2,food:3,garden:2,nursery:2}, 30,26, 'C2:pantry B2:bed D2:bed A2:garden E2:garden B3:nursery D3:nursery B4:pantry A4:bed C4:bridge D4:hall'],
  ['Home for everyone','大家的家', ['..S..','.....','~~~~~','..*..','.....'], {bed:4,pantry:2,food:4,garden:2,nursery:2}, 34,30, 'C2:pantry B2:bed D2:bed B1:nursery D1:nursery C3:bridge C4:pantry B4:bed D4:bed A4:garden E4:garden'],
];

export const coordinate = index => `${'ABCDE'[index % 5]}${Math.floor(index / 5) + 1}`;
export const cellIndex = label => (Number(label.slice(1)) - 1) * 5 + 'ABCDE'.indexOf(label[0]);
export const LEVELS = definitions.map(([name,zh,map,goals,budget,par,witness],i) => Object.freeze({
  id: String(i + 1), chapter: Math.floor(i / 5), name, zh, map: map.join(''), goals, budget, par,
  solution: witness.split(' ').map(step => { const [at,tool] = step.split(':'); return {at:cellIndex(at),tool}; }),
}));
