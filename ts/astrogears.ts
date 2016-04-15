
// FFS, really?  JS doesn't have this?
function format(formatstr:string, ...rest) {
   //let args = Array.prototype.slice.call(arguments, 1);
   return formatstr.replace(/{(\d+)}/g, function(match, number) { 
     return typeof rest[number] != 'undefined'
     ? rest[number] 
     : match
     ;
   });
}



class Result {
  wheels: number[];
  pinions: number[];
  ratio: number;
  error: number;

  constructor(geartrainLength: number, ratio: number, error: number) {
    this.ratio = ratio;
    this.error = error;
    this.wheels = new Array<number>(geartrainLength);
    this.pinions =  new Array<number>(geartrainLength);
  }

  setGears(level: number, wheel: number, pinion: number) {
    this.wheels[level] = level;
    this.pinions[level] = level;
  }

  getGears(level: number) {
    return (this.wheels[level], this.pinions[level]);
  }

  calculateGearRatio() {
    let accm: number = 1;
    for(let i = 0; i < this.wheels.length; i++) {
      accm *= (this.wheels[i] / this.pinions[i]);
    }
    return accm;
  }

  toString() {
    return format("RESULT Wheels: {0} Pinions {1} ratio: {2} +/- {3}", this.wheels, this.pinions, this.ratio, this.error);
  }
}

const target_gear_range: number = 1.002737909350795;
const error_limit: number = .000003;


function clearOutput() {
  let e = document.getElementById("output");
  e.innerHTML = "";

}

let outputDiv: Element = document.getElementById("output");
function addLineToOutput(line:string) {
  // Dunno why this is POSSIBLE, but apparently it is.
  if(outputDiv == null) {
    outputDiv = document.getElementById("output");
  }
  let newe = document.createElement("p");
  newe.innerHTML = line;
  outputDiv.appendChild(newe);
}


async function delay(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

let statusDiv: Element = document.getElementById("status");
async function updateStatus(wheel: number, pinion: number, results: number[][]) {
  if(statusDiv == null) {
    statusDiv = document.getElementById("status");
  }
  await delay(0);
  statusDiv.innerHTML = format("Wheel {0}, pinion {1}, results found: {2}", wheel, pinion, results.length);
}

function setStatus(str: string) {
  if(statusDiv == null) {
    statusDiv = document.getElementById("status");
  }
  statusDiv.innerHTML = str;
}



// Hard-coding the number of levels of recursion here is kind of silly.
// But it's not as silly as hard-coding huge nested for loops,
// and it's nearly as fast, so.
// Any kind of 'if' kills performance.
// Any kind of array allocation kills performance.
// Any kind of array lookup probably kills performance too.  
// And hardcoding array indices instead of calculating them helps a lot.
// Coding in Javascript like it's 1973!
function find_ratios_recursive_start5(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  let results: number[][] = [];
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, 0, 0, 0, 0, 0, 0, pinion1, wheel1];
      find_ratios_recursive4(ratio1, wheel1, pinion1, max_teeth, accm, results);
    }
  }
  return results;
}

function find_ratios_recursive_start4(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  let results: number[][] = [];
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, 0, 0, 0, 0, pinion1, wheel1];
      find_ratios_recursive3(ratio1, wheel1, pinion1, max_teeth, accm, results);
    }
  }
  return results;
}

async function find_ratios_recursive_start3(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  let results: number[][] = [];
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    await updateStatus(wheel1, -1, results);
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, 0, 0, pinion1, wheel1];
      find_ratios_recursive2(ratio1, wheel1, pinion1, max_teeth, accm, results);

      // We want to do this as seldom as possible while still keeping things
      // responsive.  It's a tricky balance that will be different on each
      // computer.  ;_;
      //await delay(0);
    }
  }
  return results;
}


function find_ratios_recursive_start2(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  let results: number[][] = [];
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, pinion1, wheel1];
      find_ratios_recursive1(ratio1, wheel1, pinion1, max_teeth, accm, results);
    }
  }
  return results;
}

function find_ratios_recursive4(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: number[][]) {
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      accm[7] = wheel1;
      accm[6] = pinion1;
      find_ratios_recursive3(ratio1 * ratio, wheel1, pinion1, max_teeth, accm, results);
    }
  }
}

function find_ratios_recursive3(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: number[][]) {
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      accm[5] = wheel1;
      accm[4] = pinion1;
      find_ratios_recursive2(ratio1 * ratio, wheel1, pinion1, max_teeth, accm, results);
    }
  }
}

function find_ratios_recursive2(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: number[][]) {
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      accm[3] = wheel1;
      accm[2] = pinion1;
      find_ratios_recursive1(ratio1 * ratio, wheel1, pinion1, max_teeth, accm, results);
    }
  }
}


function find_ratios_recursive1(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: number[][]) {
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let result = ratio * ratio1;
      accm[1] = wheel1;
      accm[0] = pinion1;
      let error = Math.abs(result - target_gear_range);
      if(error < error_limit) {
        // Need to copy accm and reverse it.
        // Otherwise the next call will just modify it in place.
        let accmClone = accm.slice();
        accmClone.reverse();
        results.push(accmClone);
      }
    }
  }
}


function setGuiDisabled(val:boolean) {

  let ratioElem = <HTMLInputElement>document.getElementById("targetRatio");
  let maxErrorElem = <HTMLInputElement>document.getElementById("maxError");
  let wheel1Elem = <HTMLInputElement>document.getElementById("wheel1");
  let pinion1Elem = <HTMLInputElement>document.getElementById("pinion1");
  let maxElem = <HTMLInputElement>document.getElementById("max");
  let startButton = <HTMLInputElement>document.getElementById("startButton");
  let gearTrainElem = <HTMLInputElement>document.getElementById("gearTrain");


  //ratioElem.disabled = val;
  //maxErrorElem.disabled = val;
  wheel1Elem.disabled = val;
  pinion1Elem.disabled = val;
  maxElem.disabled = val;
  startButton.disabled = val;
  //gearTrainElem.disabled = val;
}

// So we can inspect the results of a run directly should we want to.
let thingses = [];

async function run() {
  let wheel1Elem = <HTMLInputElement>document.getElementById("wheel1");
  wheel1Elem.disabled = true;
  let wheel1 = parseInt(wheel1Elem.value);
  let pinion1Elem = <HTMLInputElement>document.getElementById("pinion1");
  let pinion1 = parseInt(pinion1Elem.value);
  let maxElem = <HTMLInputElement>document.getElementById("max");
  let max = parseInt(maxElem.value);

  setGuiDisabled(true);

  clearOutput();

  let t1 = Date.now();
  let results = await find_ratios_recursive_start3(wheel1, pinion1, max);
  //console.log(results);
  let t2 = Date.now();

  let morevals = [];
  for(let values of results) {
    //console.log(values);
    let ratio = 1;
    for(let i = 0; i < values.length - 1; i += 2) {
      ratio *= (values[i] / values[i+1]);
    }
    let error = ratio - target_gear_range;
    values.push(Math.abs(error));
    morevals.push(values);
  }
  // Sort values with the smallest error first.
  morevals.sort(function (a,b){return a[6] - b[6];});
  for(let val of morevals) {
    let resultString = format("Gear train: {0}", val);
    addLineToOutput(resultString);
  }
  setStatus(format("Found {0} gear combinations in {1} seconds:", morevals.length, (t2 - t1)/1000));


  thingses = results;

  setGuiDisabled(false);
}
