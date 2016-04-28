
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

// Sigh
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

class Result {
  wheels: number[];
  pinions: number[];
  ratio: number;
  error: number;

  constructor(geararray: number[], target:number) {
    let gearTrainLength = geararray.length / 2;
    this.wheels = new Array<number>(gearTrainLength);
    this.pinions = new Array<number>(gearTrainLength);
    //console.log(gearTrainLength, this.wheels.length);
    for (let i = 0; i < gearTrainLength; i++) {
      this.wheels[i] = geararray[i * 2];
      this.pinions[i] = geararray[(i * 2) + 1];
    }
    this.calcRatio(target);
  }

  calcRatio(target: number = 1) {
    let accm = 1;
    for (let i = 0; i < this.wheels.length; i++) {
      accm *= (this.wheels[i] / this.pinions[i]);
    }
    this.ratio = accm;
    this.error = target - this.ratio;
  }

  toString():string {
    let accm = [];
    accm.push("Wheel/pinion: ")
    for (let i = 0; i < this.wheels.length; i++) {
      accm.push(zeroPad(this.wheels[i], 3));
      accm.push("/");
      accm.push(zeroPad(this.pinions[i], 3));
      accm.push(" ")
    }
    accm.push(" teeth. Gear ratio: ");
    accm.push(this.ratio.toFixed(15));
    accm.push(" error: ");
    if (this.error > 0) { accm.push("&nbsp;");}
    accm.push(this.error.toFixed(15));

    accm.push(" (drifts about ");
    accm.push(this.error * 60 * 60 * 24 * 365.25)
    accm.push(" seconds per year)")

    return accm.join('');
  }
}

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
async function updateStatus(wheel: number, results: any[]) {
  if(statusDiv == null) {
    statusDiv = document.getElementById("status");
  }
  await delay(1);
  statusDiv.innerHTML = format("Working on wheel {0}, results found: {1}...", wheel, results.length);
}

function setStatus(str: string) {
  if(statusDiv == null) {
    statusDiv = document.getElementById("status");
  }
  statusDiv.innerHTML = str;
}

function setGuiDisabled(val:boolean) {

  let ratioElem = <HTMLInputElement>document.getElementById("targetRatio");
  let maxErrorElem = <HTMLInputElement>document.getElementById("maxError");
  let wheel1Elem = <HTMLInputElement>document.getElementById("wheel1");
  let pinion1Elem = <HTMLInputElement>document.getElementById("pinion1");
  let maxElem = <HTMLInputElement>document.getElementById("max");
  let startButton = <HTMLInputElement>document.getElementById("startButton");
  let gearTrainElem = <HTMLInputElement>document.getElementById("geartrain");


  //ratioElem.disabled = val;
  //maxErrorElem.disabled = val;
  wheel1Elem.disabled = val;
  pinion1Elem.disabled = val;
  maxElem.disabled = val;
  startButton.disabled = val;
  gearTrainElem.disabled = val;
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

  let ratioElem = <HTMLInputElement>document.getElementById("targetRatio");
  let ratio = parseFloat(ratioElem.value);
  let maxErrorElem = <HTMLInputElement>document.getElementById("maxError");
  let error = parseFloat(maxErrorElem.value);


  let geartrainElem = <HTMLInputElement>document.getElementById("geartrain");
  let geartrain = parseInt(geartrainElem.value);
  //console.log(geartrain);

  setGuiDisabled(true);

  clearOutput();

  let t1 = Date.now();
  let results = await geargen_dispatch(geartrain, wheel1, max, ratio, error);
  //console.log(results);
  let t2 = Date.now();

  // Sort results
  results.sort((r1, r2) => Math.abs(r1.error) - Math.abs(r2.error));
  for (let result of results) {
    addLineToOutput(result.toString());
  }
  setStatus(format("Found {0} gear combinations in {1} seconds:", results.length, (t2 - t1)/1000));


  thingses = results;

  setGuiDisabled(false);
}