const initialProgram = [1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,6,1,19,1,5,19,23,2,9,23,27,1,6,27,31,1,31,9,35,2,35,10,39,1,5,39,43,2,43,9,47,1,5,47,51,1,51,5,55,1,55,9,59,2,59,13,63,1,63,9,67,1,9,67,71,2,71,10,75,1,75,6,79,2,10,79,83,1,5,83,87,2,87,10,91,1,91,5,95,1,6,95,99,2,99,13,103,1,103,6,107,1,107,5,111,2,6,111,115,1,115,13,119,1,119,2,123,1,5,123,0,99,2,0,14,0];

function intcode(program) {
  let address = 0;
  let currOpCode = program[address];
  
  while(validOpCode(currOpCode)) {
    if(currOpCode === 99) {
      // console.log('program ended normally', program);
      return program[0];
    }

    const firstParameterAddress = program[address + 1];
    const secondParameterAddress = program[address + 2];
    const outputParameterAddress = program[address + 3];
    if(currOpCode === 1) {
      // Add
      program[outputParameterAddress] = program[firstParameterAddress] + program[secondParameterAddress];
      moveOpCode();
      continue;
    }
    if(currOpCode === 2) {
      // Multiply
      program[outputParameterAddress] = program[firstParameterAddress] * program[secondParameterAddress];
      moveOpCode();
      continue;
    }
    console.log('error', program);
    throw new Error('program ended unexpectedly');
  }

  console.log('program ended unexpectedly', program);
  throw new Error('program ended unexpectedly');

  function validOpCode(opCode) {
    if(opCode === 1 || opCode === 2 || opCode === 99) {
      return true;
    } else {
      return false;
    }
  }

  function moveOpCode() {
    address = address + 4;
    currOpCode = program[address];
  }
}

function findParameters() {
  for(let noun = 0; noun <= 99; noun++) {
    for(let verb = 0; verb <= 99; verb++) {
      try {
        const newProgram = initialProgram.slice();
        newProgram[1] = noun;
        newProgram[2] = verb;
        const res = intcode(newProgram);
        if(res === 19690720) {
          console.log(noun, verb);
        }
      } catch (error) {
        continue;
      }
    }
  }
}
findParameters();
