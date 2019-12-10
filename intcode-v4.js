function* intcode(program) {
  program = program.slice();
  let address = 0;
  let currOpCode = program[address];
  let lastOutput;
  
  while(validOpCode(currOpCode)) {
    if(currOpCode === 99) {
      // console.log('program ended normally', lastOutput);
      return lastOutput;
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
      const input = yield { type: 'input' };
      if(input === null || input === undefined) {
        throw new Error('input cannot be undefined');
      }
      program = setOutputParameter(input, firstParameterMode, address + 1, program);
      moveOpCode(2);
      continue;
    }
    if(opCode === 4) {
      // Output
      const firstParam = getInputParameter(firstParameterMode, address + 1, program);
      lastOutput = firstParam;
      yield { type: 'output', value: lastOutput };
      moveOpCode(2);
      continue;
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

    console.log('error', program, opCode);
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

exports.intcode = intcode;
