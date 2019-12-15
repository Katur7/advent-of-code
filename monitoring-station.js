const fs = require('fs');

function readMap() {
  const fileName = 'monitoring-station-input.txt';
  const contents = fs.readFileSync(fileName, 'utf8');
  const lines = contents.split(/\n/);
  return lines.map(l => l.split(''));
}

const map = readMap();
partOne(map);
partTwo(map);

function partOne(map) {
  const best = {
    point: {x: 0, y: 0},
    count: -1
  };
  for(const p of mapIterator(map)) {
    if(isAsteroid(p, map)) {
      const asteroids = countAsteroids(p, map);
      if(asteroids > best.count) {
        best.point = p;
        best.count = asteroids;
      }
    }
  }
  console.log(best);
}

function partTwo(map) {
  const station = {x: 23, y: 29};
  let kills = 0;
  const { topRight, bottomRight, bottomLeft, topLeft } = asteroidsByQuadrants(station, map);
  kills = killQuadrant(kills, topRight);
  kills = killQuadrant(kills, bottomRight);
  kills = killQuadrant(kills, bottomLeft);
  kills = killQuadrant(kills, topLeft);
}

function killQuadrant(kills, quadrant) {
  const keys = Array.from(quadrant.keys()).sort((a, b) => a - b);
  for(const slope of keys) {
    const asteroids = quadrant.get(slope);
    kills++;
    if(kills === 200) {
      console.log(kills, asteroids[0]);
    }
    if(asteroids.length > 1) {
      quadrant.set(slope, asteroids.slice(1));
    } else {
      quadrant.delete(slope);
    }
  }
  return kills;
}

function asteroidsByQuadrants(station, map) {
  const sMap = slopeMap(station, map);

  const height = map.length - 1;
  const width = map[0].length - 1;
  const topRight = new Map();
  const bottomRight = new Map();
  const bottomLeft = new Map();
  const topLeft = new Map();

  for(let y = 0; y < station.y; y++) {
    for(let x = station.x; x <= width; x++) {
      const slope = sMap[y][x];
      if(slope !== null && !topRight.has(slope)) {
        const asteroidsOnSlope = asteroidsInALine(station, {x, y}, height, width);
        topRight.set(slope, asteroidsOnSlope);
      }
    }
  }
  for(let y = station.y; y <= height; y++) {
    for(let x = station.x; x <= width; x++) {
      const slope = sMap[y][x];
      if(slope !== null && !bottomRight.has(slope)) {
        const asteroidsOnSlope = asteroidsInALine(station, {x, y}, height, width);
        bottomRight.set(slope, asteroidsOnSlope);
      }
    }
  }
  for(let y = station.y; y <= height; y++) {
    for(let x = 0; x < station.x; x++) {
      const slope = sMap[y][x];
      if(slope !== null && !bottomLeft.has(slope)) {
        const asteroidsOnSlope = asteroidsInALine(station, {x, y}, height, width);
        bottomLeft.set(slope, asteroidsOnSlope);
      }
    }
  }
  for(let y = 0; y < station.y; y++) {
    for(let x = 0; x < station.x; x++) {
      const slope = sMap[y][x];
      if(slope !== null && !topLeft.has(slope)) {
        const asteroidsOnSlope = asteroidsInALine(station, {x, y}, height, width);
        topLeft.set(slope, asteroidsOnSlope);
      }
    }
  }
  return {
    topRight,
    bottomRight,
    bottomLeft,
    topLeft
  }
}

function countAsteroids(potentialStation, map) {
  const asteroids = new Set();
  for(const b of mapIterator(map)) {
    const points = pointsInALine(potentialStation, b, map.length - 1, map[0].length - 1);
    const asteroid = points.find(p => isAsteroid(p, map));
    if(asteroid) {
      asteroids.add(asteroid.x + ',' + asteroid.y);
    }
  }
  return asteroids.size;
}

function asteroidsInALine(p1, p2, height, width) {
  const pointsOnSlope = pointsInALine(p1, p2, height, width);
  return pointsOnSlope.filter(p => isAsteroid(p, map));
}

function pointsInALine(p1, p2, height, width) {
  if(isSamePoint(p1, p2)) {
    return [];
  }

  const slope = calcSlope(p1, p2);
  const c = p1.y - p1.x * slope;
  const points = [];
  if(Math.abs(slope) === Infinity) {
    // Vertical line
    if(p1.y < p2.y) {
      // Downwards slope
      for(let y = p1.y + 1; y <= height; y++) {
        points.push({x: p1.x, y});
      }
    } else {
      // Upwards slope
      for(let y = p1.y - 1; y >= 0; y--) {
        points.push({x: p1.x, y});
      }
    }
    return points;
  }
  
  const minY = Math.min(p1.y, 0);
  const maxY = Math.max(p1.y, height);
  if(p1.x < p2.x) {
    // Righwards slope
    for(let x = p1.x + 1; x <= width; x++) {
      const y = calcY(slope, x, c);
      if(Number.isInteger(y) && y >=  minY && y <= maxY) {
        points.push({x, y});
      }
    }
  } else {
    // Leftwards slope
    for(let x = p1.x - 1; x >= 0; x--) {
      const y = calcY(slope, x, c);
      if(Number.isInteger(y) && y >=  minY && y <= maxY) {
        points.push({x, y});
      }
    }
  }
  return points;

  function calcY(slope, x, c) {
    const y = slope * x + c;
    return Number(y.toFixed(5)); 
  }
}

function calcSlope(p1, p2) {
  return (p2.y - p1.y) / (p2.x - p1.x);
}

function slopeMap(station, map) {
  const slopeMap = deepCopyMap(map);
  for(const p of mapIterator(slopeMap)) {
    if(isAsteroid(p, slopeMap) && !isSamePoint(station, p)) {
      slopeMap[p.y][p.x] = calcSlope(station, p);
    } else {
      slopeMap[p.y][p.x] = null;
    }
  }
  return slopeMap;
}

function* mapIterator(map) {
  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[0].length; x++) {
      yield {x, y};
    }
  }
}

function isSamePoint(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function isAsteroid(point, map) {
  try {
    return map[point.y][point.x] === '#';
  } catch (e) {
    console.error(point, map);
    throw e;
  }
}

function deepCopyMap(map) {
  return map.map(line => line.slice());
}
