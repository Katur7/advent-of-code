const fs = require('fs');

function readMap() {
  const fileName = 'monitoring-station-input.txt';
  const contents = fs.readFileSync(fileName, 'utf8');
  const lines = contents.split(/\n/);
  return lines.map(l => l.split(''));
}

const map = readMap();
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
// console.log(countAsteroids({x: 1, y: 2}, map));

function countAsteroids(potentialStation, map) {
  const asteroids = new Set();
  for(const b of mapIterator(map)) {
    const points = pointsInALine(potentialStation, b);
    const asteroid = points.find(p => isAsteroid(p, map));
    if(asteroid) {
      asteroids.add(asteroid.x + ',' + asteroid.y);
    }
  }
  return asteroids.size;
}

function pointsInALine(p1, p2) {
  if(isSamePoint(p1, p2)) {
    return [];
  }

  const slope = (p2.y - p1.y) / (p2.x - p1.x);
  const c = p1.y - p1.x * slope;
  const points = [];
  if(Math.abs(slope) === Infinity) {
    // Vertical line
    if(p1.y < p2.y) {
      // Downwards slope
      for(let y = p1.y + 1; y <= p2.y; y++) {
        points.push({x: p1.x, y});
      }
    } else {
      // Upwards slope
      for(let y = p1.y - 1; y >= p2.y; y--) {
        points.push({x: p1.x, y});
      }
    }
    return points;
  }
  
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);
  if(p1.x < p2.x) {
    // Righwards slope
    for(let x = p1.x + 1; x <= p2.x; x++) {
      const y = calcY(slope, x, c);
      if(Number.isInteger(y) && y >=  minY && y <= maxY) {
        points.push({x, y});
      }
    }
  } else {
    // Leftwards slope
    for(let x = p1.x - 1; x >= p2.x; x--) {
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

function* mapIterator(map) {
  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[0].length; x++) {
      yield {x, y};
    }
  }
}

function* mapBoundaryIterator(point, map) {
  const height = map.length;
  const width = map[0].length;
  const topLeft = {x: 0, y: 0};
  const topRight = {x: width - 1, y: 0};
  const bottomLeft = {x: 0, y: height - 1};
  const bottomRight = {x: width - 1, y: height - 1};

  if(point.y === 0 ) {
    if(point.x === 0) {
      yield topRight;
    } else if (point.x === width - 1) {
      yield topLeft;
    } else {
      yield topLeft;
      yield topRight;
    }
  } else {
    for(let x = 0; x < width; x++) {
      yield {x, y: 0};
    }
  }

  if(point.x === width - 1) {
    if(!isSamePoint(point, bottomRight)) {
      yield bottomRight;
    }
  } else {
    for(let y = 1; y < height; y++) {
      yield {x: width - 1, y};
    }
  }

  if(point.y === height - 1) {
    if(!isSamePoint(point, bottomLeft)) {
      yield bottomLeft;
    }
  } else {
    for(let x = width - 2; x >= 0; x--) {
      yield {x, y: height - 1};
    }
  }

  if(point.x !== 0) {
    for(let y = height - 2; y > 0; y--) {
      yield {x: 0, y};
    }
  }

}

function isSamePoint(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function isAsteroid(point, map) {
  return map[point.y][point.x] === '#';
}

function calcDistance(p1, p2) {
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);
  return x + y;
}