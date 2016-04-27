
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



// Hard-coding the number of levels of recursion here is kind of silly.
// But it's not as silly as hard-coding huge nested for loops,
// and it's nearly as fast, so.
// Any kind of 'if' kills performance.
// Any kind of array allocation kills performance.
// Any kind of array lookup probably kills performance too.  
// And hardcoding array indices instead of calculating them helps a lot.
// Coding in Javascript like it's 1973!
async function find_ratios_recursive_start5(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, target_number: number, target_error: number) {
  let results: Result[] = [];
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      await updateStatus(wheel1, results);
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, 0, 0, 0, 0, 0, 0, pinion1, wheel1];
      find_ratios_recursive4(ratio1, wheel1, pinion1, wheel1, accm, results, target_number, target_error);
    }
  }
  return results;
}

async function find_ratios_recursive_start4(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, target_number: number, target_error: number) {
  let results: Result[] = [];
  for (let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for (let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      await updateStatus(wheel1, results);
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, 0, 0, 0, 0, pinion1, wheel1];
      find_ratios_recursive3(ratio1, wheel1, pinion1, max_teeth, accm, results, target_number, target_error);
    }
  }
  return results;
}

async function find_ratios_recursive_start3(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, target_number: number, target_error: number) {
  let results: Result[] = [];
  for (let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    await updateStatus(wheel1, results);
    for (let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, 0, 0, pinion1, wheel1];
      find_ratios_recursive2(ratio1, wheel1, pinion1, max_teeth, accm, results, target_number, target_error);
    }
  }
  return results;
}


async function find_ratios_recursive_start2(min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, target_number: number, target_error: number) {
  let results: Result[] = [];
  for (let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    await updateStatus(wheel1, results);
    for (let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let accm : number[] = [0, 0, pinion1, wheel1];
      find_ratios_recursive1(ratio1, wheel1, pinion1, max_teeth, accm, results, target_number, target_error);
    }
  }
  return results;
}

function find_ratios_recursive4(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: Result[], target_number: number, target_error: number) {
  for (let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for (let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      accm[7] = wheel1;
      accm[6] = pinion1;
      find_ratios_recursive3(ratio1 * ratio, wheel1, pinion1, max_teeth, accm, results, target_number, target_error);
    }
  }
}

function find_ratios_recursive3(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: Result[], target_number: number, target_error: number) {
  for (let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for (let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      accm[5] = wheel1;
      accm[4] = pinion1;
      find_ratios_recursive2(ratio1 * ratio, wheel1, pinion1, max_teeth, accm, results, target_number, target_error);
    }
  }
}

function find_ratios_recursive2(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: Result[], target_number: number, target_error: number) {
  for (let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for (let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      accm[3] = wheel1;
      accm[2] = pinion1;
      find_ratios_recursive1(ratio1 * ratio, wheel1, pinion1, max_teeth, accm, results, target_number, target_error);
    }
  }
}


function find_ratios_recursive1(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: number[], results: Result[], target_number: number, target_error: number) {
  for (let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for (let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let result = ratio * ratio1;
      accm[1] = wheel1;
      accm[0] = pinion1;
      let error = Math.abs(result - target_number);
      if(error < target_error) {
        let a = accm.slice();
        a.reverse();
        let r = new Result(a, target_number);
        //console.log("Making result", r, "error is", error, "error limit is", error_limit);
        results.push(r);
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
  let results = []
  switch(geartrain) {
    case 2:
      results = await find_ratios_recursive_start2(wheel1, pinion1, max, ratio, error);
      break;
    case 3:
      results = await find_ratios_recursive_start3(wheel1, pinion1, max,  ratio, error);
      break;
    case 4:
      results = await find_ratios_recursive_start4(wheel1, pinion1, max,  ratio, error);
      break;
    case 5:
      results = await find_ratios5(wheel1, max,  ratio, error);
      break;
  }
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

async function find_ratios5(min_teeth: number, max_teeth: number, target_number: number, target_error: number) {
	let results: Result[] = [];
  for (let gear1 = min_teeth; gear1 <= max_teeth; gear1++) {
    console.log("Finding ratios", gear1);
        await updateStatus(gear1, results);

    
		 for(let gear2 = min_teeth; gear2 <= max_teeth; gear2++) {
			
			for(let gear3 = min_teeth; gear3 <= max_teeth; gear3++) {
				
				for(let gear4 = min_teeth; gear4 <= max_teeth; gear4++) {
					
let result = (gear1 / gear2) * (gear3 / gear4);
let error = Math.abs(result - target_number);
if(error < target_error) {
	let gearArray: number[] = [gear1,gear2,gear3,gear4];
	let r = new Result(gearArray, target_number);
	results.push(r);
}
	
				}
			}
		}
	}
	return results;
}
	
