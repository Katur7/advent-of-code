// const initialProgram = [3,225,1,225,6,6,1100,1,238,225,104,0,1101,37,34,224,101,-71,224,224,4,224,1002,223,8,223,101,6,224,224,1,224,223,223,1002,113,50,224,1001,224,-2550,224,4,224,1002,223,8,223,101,2,224,224,1,223,224,223,1101,13,50,225,102,7,187,224,1001,224,-224,224,4,224,1002,223,8,223,1001,224,5,224,1,224,223,223,1101,79,72,225,1101,42,42,225,1102,46,76,224,101,-3496,224,224,4,224,102,8,223,223,101,5,224,224,1,223,224,223,1102,51,90,225,1101,11,91,225,1001,118,49,224,1001,224,-140,224,4,224,102,8,223,223,101,5,224,224,1,224,223,223,2,191,87,224,1001,224,-1218,224,4,224,1002,223,8,223,101,4,224,224,1,224,223,223,1,217,83,224,1001,224,-124,224,4,224,1002,223,8,223,101,5,224,224,1,223,224,223,1101,32,77,225,1101,29,80,225,101,93,58,224,1001,224,-143,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,1101,45,69,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,7,226,226,224,102,2,223,223,1005,224,329,101,1,223,223,108,677,226,224,102,2,223,223,1005,224,344,1001,223,1,223,1108,226,677,224,102,2,223,223,1005,224,359,1001,223,1,223,8,677,226,224,102,2,223,223,1006,224,374,1001,223,1,223,107,226,226,224,102,2,223,223,1006,224,389,101,1,223,223,1108,677,226,224,1002,223,2,223,1005,224,404,1001,223,1,223,108,677,677,224,102,2,223,223,1005,224,419,101,1,223,223,7,226,677,224,1002,223,2,223,1006,224,434,1001,223,1,223,107,226,677,224,102,2,223,223,1005,224,449,101,1,223,223,1108,677,677,224,1002,223,2,223,1006,224,464,101,1,223,223,7,677,226,224,102,2,223,223,1006,224,479,101,1,223,223,1007,677,677,224,1002,223,2,223,1005,224,494,101,1,223,223,1008,226,226,224,102,2,223,223,1006,224,509,1001,223,1,223,107,677,677,224,102,2,223,223,1006,224,524,1001,223,1,223,8,226,226,224,1002,223,2,223,1005,224,539,1001,223,1,223,1007,677,226,224,102,2,223,223,1006,224,554,1001,223,1,223,1007,226,226,224,1002,223,2,223,1005,224,569,1001,223,1,223,8,226,677,224,1002,223,2,223,1006,224,584,101,1,223,223,108,226,226,224,1002,223,2,223,1006,224,599,101,1,223,223,1107,677,226,224,1002,223,2,223,1005,224,614,1001,223,1,223,1107,226,677,224,102,2,223,223,1006,224,629,1001,223,1,223,1008,226,677,224,102,2,223,223,1005,224,644,101,1,223,223,1107,226,226,224,102,2,223,223,1006,224,659,1001,223,1,223,1008,677,677,224,102,2,223,223,1006,224,674,1001,223,1,223,4,223,99,226];

// intcode([5], initialProgram);

function intcode(input, program) {
  let address = 0;
  let currOpCode = program[address];
  
  while(validOpCode(currOpCode)) {
    if(currOpCode === 99) {
      console.log('program ended normally', program);
      return program[0];
    }

    const opCode = getOpCode(currOpCode);
    const firstParameterMode = getFirstParameterMode(currOpCode);
    const secondParameterMode = getSecondParameterMode(currOpCode);
    const thirdParameterMode = getThirdParameterMode(currOpCode);

    if(opCode === 1) {
      // Add
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      const secondParam = getInputParameter(secondParameterMode, address + 2, program);
      program = setOutputParameter(firstParam + secondParam, thirdParameterMode, address + 3, program);
      moveOpCode(4);
      continue;
    }
    if(opCode === 2) {
      // Multiply
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      const secondParam = getInputParameter(secondParameterMode, address + 2, program);
      program = setOutputParameter(firstParam * secondParam, thirdParameterMode, address + 3, program);
      moveOpCode(4);
      continue;
    }
    if(opCode === 3) {
      // Input
      const i = input.shift();
      if(i !== undefined) {
        program = setOutputParameter(i, firstParameterMode, address + 1, program);
        moveOpCode(2);
        continue;
      } else {
        throw new Error('Missing input');
      }
    }
    if(opCode === 4) {
      // Output
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      // console.log('Output', firstParam);
      // moveOpCode(2);
      // continue;
      return firstParam;
    }
    if(opCode === 5) {
      // jump-if-true
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      if(firstParam !== 0) {
        address = getInputParameter(secondParameterMode, address + 2, program);
        currOpCode = program[address];
      } else {
        moveOpCode(3);
      }
      continue;
    }
    if(opCode === 6) {
      // jump-if-false
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      if(firstParam === 0) {
        address = getInputParameter(secondParameterMode, address + 2, program);
        currOpCode = program[address];
      } else {
        moveOpCode(3);
      }
      continue;
    }
    if(opCode === 7) {
      // less than
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      const secondParam = getInputParameter(secondParameterMode, address + 2, program);
      if(firstParam < secondParam) {
        program = setOutputParameter(1, thirdParameterMode, address + 3, program);
      } else {
        program = setOutputParameter(0, thirdParameterMode, address + 3, program);
      }
      moveOpCode(4);
      continue;
    }
    if(opCode === 8) {
      // equals
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      const secondParam = getInputParameter(secondParameterMode, address + 2, program);
      if(firstParam === secondParam) {
        program = setOutputParameter(1, thirdParameterMode, address + 3, program);
      } else {
        program = setOutputParameter(0, thirdParameterMode, address + 3, program);
      }
      moveOpCode(4);
      continue;
    }

    console.log('error', program);
    throw new Error('program ended unexpectedly');
  }

  console.log('program ended unexpectedly', program);
  throw new Error('program ended unexpectedly');

  function validOpCode(rawOpCode) {
    const opCode = getOpCode(rawOpCode);
    if(opCode === 1 ||
       opCode === 2 ||
       opCode === 3 ||
       opCode === 4 ||
       opCode === 5 ||
       opCode === 6 ||
       opCode === 7 ||
       opCode === 8 ||
       opCode === 99) {
      return true;
    } else {
      return false;
    }
  }

  function moveOpCode(toMove) {
    address = address + toMove;
    currOpCode = program[address];
  }
}

function getOpCode(rawOpCode) {
  return rawOpCode % 100;
}
function getFirstParameterMode(rawOpCode) {
  return Math.floor((rawOpCode % 1000) / 100)
}
function getSecondParameterMode(rawOpCode) {
  return Math.floor((rawOpCode % 10000) / 1000)
}
function getThirdParameterMode(rawOpCode) {
  return Math.floor((rawOpCode % 100000) / 10000)
}
function getInputParameter(mode, address, program) {
  if(mode === 0) {
    const parameterAddress = program[address];
    return program[parameterAddress];
  } else {
    return program[address];
  }
}
function setOutputParameter(value, mode, address, program) {
  if(mode === 0) {
    const parameterAddress = program[address];
    program[parameterAddress] = value;
    return program;
  } else {
    program[address] = value;
    return program;
  }
}

exports.intcode = (input, program) => intcode(input, program);
