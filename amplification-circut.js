const v3 = require('./intcode-v3'); 

const program = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5];

function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

const allPhasePermutations = perm([5,6,7,8,9]);
let maxOutput = 0;

(async function() {
  const phases = allPhasePermutations[0];
  // console.log('Status: ' + i + '/' + allPhasePermutations.length, phases);
  await amplify(phases);
  for(let i = 0; i < allPhasePermutations.length; i++) {
    // let code = 'start';
    // let lastValue = 0;
    // do {
    //   const aOutput = v2.intcode([phases[0], lastValue], program);
    //   const bOutput = v2.intcode([phases[1], aOutput.value], program);
    //   const cOutput = v2.intcode([phases[2], bOutput.value], program);
    //   const dOutput = v2.intcode([phases[3], cOutput.value], program);
    //   const eOutput = v2.intcode([phases[4], dOutput.value], program);
    //   code = eOutput.code;
    //   lastValue = eOutput.value
    //   console.log(eOutput);
    // } while(code !== 'end')
    // maxOutput = Math.max(maxOutput, lastValue);
  }
}());

async function amplify(phases) {
  let maxOutput = 0;
  const resolvers = {
    a: null,
    b: null,
    c: null,
    d: null,
    e: null
  }
  const inputs = {
    a: () => {
      const p = inputs.a;
      inputs.a = new Promise((resolve) => {
        resolvers.a = (input) => resolve(input);
      });
      return p;
    },
    b: () => {
      const p = inputs.b;
      inputs.b = new Promise((resolve) => {
        resolvers.b = (input) => resolve(input);
      });
      return p;
    },
    c: () => {
      const p = inputs.c;
      inputs.c = new Promise((resolve) => {
        resolvers.c = (input) => resolve(input);
      });
      return p;
    },
    d: () => {
      const p = inputs.d;
      inputs.d = new Promise((resolve) => {
        resolvers.d = (input) => resolve(input);
      });
      return p;
    },
    e: () => {
      const p = inputs.e;
      inputs.e = new Promise((resolve) => {
        resolvers.e = (input) => resolve(input);
      });
      return p;
    },
  }
  inputs.a = Promise.resolve(0);    // Starting input
  const outputs = {
    a: (out) => {
      inputs.b = () => resolvers.b(out);
    },
    b: (out) => {
      inputs.c = () => resolvers.c(out);
    },
    c: (out) => {
      inputs.d = () => resolvers.d(out);
    },
    d: (out) => {
      inputs.e = () => resolvers.e(out);
    },
    e: (out) => {
      maxOutput = Math.max(maxOutput. out);
      console.log('MaxOutput', maxOutput);
      resolvers.a(out);
    },
  }
  v3.intcode(phases[0], inputs.a, outputs.a, program);
  v3.intcode(phases[1], inputs.b, outputs.b, program);
  v3.intcode(phases[2], inputs.c, outputs.c, program);
  v3.intcode(phases[3], inputs.d, outputs.d, program);
  return await v3.intcode(phases[4], inputs.e, outputs.e, program);
}

console.log('Amp output', maxOutput);

