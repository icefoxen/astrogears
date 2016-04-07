
//import "babel-polyfill";

const target_gear_range: number = 1.002737909350795;
const error_limit: number = .000003;

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

function clearOutput() {
  let e = document.getElementById("output");
  e.innerHTML = "";

}
function addLineToOutput(line:string) {
  let e = document.getElementById("output");
  let newe = document.createElement("p");
  newe.innerHTML = line;
  e.appendChild(newe);
  //e.innerHTML += "<p>" + line + "</p>";
}


async function delay(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function updateStatus(wheel: number, pinion: number, results: number[][]) {
  await delay(0);
  let e = document.getElementById("output");
  e.innerHTML = format("Wheel {0}, pinion {1}, results found: {2}", wheel, pinion, results.length);
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

// So we can inspect the results of a run directly should we want to.
let thingses = [];

async function run() {
  clearOutput();
  let t1 = Date.now();

  let results = await find_ratios_recursive_start3(5, 5, 100);
  console.log(results);

  let t2 = Date.now();
  for(let values of results) {
    console.log(values);
    let ratio = 1;
    for(let i = 0; i < values.length - 1; i += 2) {
      ratio *= (values[i] / values[i+1]);
    }
    console.log(ratio, ratio - target_gear_range);
  }
  console.log(t2 - t1);


  thingses = results;
}
