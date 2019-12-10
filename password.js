const MIN = 136760;
const MAX = 595730;

findPassword(MIN, MAX);

function findPassword(min, max) {
  let counter = 0;
  for(let i = min; i <= max; i++) {
    if(validate(i)) {
      counter++;
    }
  }
  console.log('Number of unique passwords', counter);
  return counter;
}

function validate(number) {
  const strNumber = '' + number;
  const digitCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for(let i = 0; i < 6; i++) {
    const c = strNumber[i];

    // Two adjacent digits are the same (like 22 in 122345).
    // the two adjacent matching digits are not part of a larger group of matching digits.
    const currNum = parseInt(c);
    digitCount[currNum]++;

    if(i < 5) {
      const next = strNumber[i + 1];

      // Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
      if(c > next) {
        return false;
      }
    }
  }

  // Finished the loop; check if two and only two were the same
  for(d of digitCount) {
    if(d === 2) {
      return true;
    }
  }
  return false;
}