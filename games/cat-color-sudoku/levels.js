(function () {
  "use strict";

  const CHAPTER_SIZES = [4, 5, 5, 6, 6, 7];
  const PERMUTATIONS = new Map();

  function rng(seed) {
    let value = seed >>> 0;
    return function () {
      value += 0x6d2b79f5;
      let next = value;
      next = Math.imul(next ^ (next >>> 15), next | 1);
      next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
      return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
    };
  }

  function permutations(size) {
    if (PERMUTATIONS.has(size)) return PERMUTATIONS.get(size);
    const results = [];
    const used = Array(size).fill(false);
    const current = [];
    function visit(row) {
      if (row === size) {
        results.push(current.slice());
        return;
      }
      for (let column = 0; column < size; column += 1) {
        if (used[column]) continue;
        if (row && Math.abs(current[row - 1] - column) <= 1) continue;
        used[column] = true;
        current.push(column);
        visit(row + 1);
        current.pop();
        used[column] = false;
      }
    }
    visit(0);
    PERMUTATIONS.set(size, results);
    return results;
  }

  function neighbors(index, size) {
    const row = Math.floor(index / size);
    const column = index % size;
    const output = [];
    if (row > 0) output.push(index - size);
    if (row < size - 1) output.push(index + size);
    if (column > 0) output.push(index - 1);
    if (column < size - 1) output.push(index + 1);
    return output;
  }

  function growRegions(size, solution, random) {
    const regions = Array(size * size).fill(-1);
    solution.forEach((column, row) => {
      regions[row * size + column] = row;
    });
    let unfilled = size * size - size;
    while (unfilled > 0) {
      const frontier = [];
      for (let index = 0; index < regions.length; index += 1) {
        if (regions[index] < 0) continue;
        neighbors(index, size).forEach((next) => {
          if (regions[next] < 0) frontier.push([next, regions[index]]);
        });
      }
      if (!frontier.length) return null;
      const [cell, region] = frontier[Math.floor(random() * frontier.length)];
      if (regions[cell] < 0) {
        regions[cell] = region;
        unfilled -= 1;
      }
    }
    return regions;
  }

  function countSolutions(size, regions, limit) {
    let count = 0;
    const columns = Array(size).fill(false);
    const usedRegions = Array(size).fill(false);
    function visit(row, previousColumn) {
      if (count >= limit) return;
      if (row === size) {
        count += 1;
        return;
      }
      for (let column = 0; column < size; column += 1) {
        const region = regions[row * size + column];
        if (columns[column] || usedRegions[region]) continue;
        if (row && Math.abs(previousColumn - column) <= 1) continue;
        columns[column] = true;
        usedRegions[region] = true;
        visit(row + 1, column);
        columns[column] = false;
        usedRegions[region] = false;
      }
    }
    visit(0, -10);
    return count;
  }

  function regionConnected(size, regions, region) {
    const members = regions.map((value, index) => value === region ? index : -1).filter((index) => index >= 0);
    const visited = new Set(members.slice(0, 1));
    const queue = members.slice(0, 1);
    while (queue.length) {
      const current = queue.shift();
      neighbors(current, size).forEach((next) => {
        if (regions[next] === region && !visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      });
    }
    return members.length > 0 && visited.size === members.length;
  }

  function createLevel(number) {
    const chapter = Math.floor((number - 1) / 5);
    const size = CHAPTER_SIZES[chapter];
    const candidates = permutations(size);
    const baseSeed = 0xc470000 + number * 7919;
    for (let attempt = 0; attempt < 4000; attempt += 1) {
      const random = rng(baseSeed + attempt * 104729);
      const solution = candidates[Math.floor(random() * candidates.length)];
      const regions = growRegions(size, solution, random);
      if (!regions || countSolutions(size, regions, 2) !== 1) continue;
      const starterCount = number === 1 ? 2 : number <= 3 ? 1 : 0;
      const starters = [];
      for (let offset = 0; offset < starterCount; offset += 1) {
        const row = (number + offset * 2) % size;
        starters.push(row * size + solution[row]);
      }
      return {
        id: number,
        chapter,
        size,
        regions,
        solution: solution.map((column, row) => row * size + column),
        starters,
        seed: baseSeed + attempt * 104729,
      };
    }
    throw new Error(`Unable to create unique Cat Color Sudoku stage ${number}`);
  }

  const levels = Array.from({ length: 30 }, (_, index) => createLevel(index + 1));

  function validateLevel(level) {
    const errors = [];
    const { size, regions, solution } = level;
    if (regions.length !== size * size) errors.push("cell-count");
    if (new Set(regions).size !== size) errors.push("region-count");
    for (let region = 0; region < size; region += 1) {
      if (!regionConnected(size, regions, region)) errors.push(`region-${region}-disconnected`);
    }
    if (solution.length !== size) errors.push("solution-count");
    const rows = new Set();
    const columns = new Set();
    const solutionRegions = new Set();
    solution.forEach((index) => {
      rows.add(Math.floor(index / size));
      columns.add(index % size);
      solutionRegions.add(regions[index]);
    });
    if (rows.size !== size) errors.push("solution-rows");
    if (columns.size !== size) errors.push("solution-columns");
    if (solutionRegions.size !== size) errors.push("solution-regions");
    const ordered = solution.slice().sort((a, b) => a - b);
    for (let row = 1; row < ordered.length; row += 1) {
      if (Math.abs((ordered[row] % size) - (ordered[row - 1] % size)) <= 1) errors.push("solution-touching");
    }
    if (countSolutions(size, regions, 2) !== 1) errors.push("not-unique");
    return errors;
  }

  window.CAT_COLOR_SUDOKU_LEVELS = levels;
  window.CAT_COLOR_SUDOKU_VALIDATE = () => levels.map((level) => ({ id: level.id, errors: validateLevel(level) }));
})();
