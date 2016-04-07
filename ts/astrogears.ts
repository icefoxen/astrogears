
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

async function printDelayed(elements: string[]) {
  for (const element of elements) {
    await delay(200);
    addLineToOutput(element);
    //console.log(element);
  }
}


/*
printDelayed(["Hello", "beautiful", "asynchronous", "world"]).then(() => {
   addLineToOutput("\n");
   addLineToOutput("Printed every element!");
});
*/

async function find_ratios_recursive_silliness3(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let a = [wheel1, pinion1];
      find_ratios_recursive_silliness2(ratio1 * ratio, wheel1, pinion1, max_teeth, [a]);
      await delay(0);
      //console.log("Delaying on wheel", wheel1, ", pinion ", pinion1);
    }
    // We want to do this as seldom as possible while still keeping things
    // responsive.  It's a tricky balance that will be different on each
    // computer.  ;_;
    console.log("Delaying on wheel", wheel1);
  }
}

function find_ratios_recursive_silliness2(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number, accm: [number,number][]) {
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      let a = [wheel1, pinion1];
      let arr = accm.concat(a);
      find_ratios_recursive_silliness1(ratio1 * ratio, wheel1, pinion1, max_teeth);
    }
  }
}

function find_ratios_recursive_silliness1(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      find_ratios_recursive_silliness0(ratio1 * ratio, wheel1, pinion1, max_teeth);
    }
  }
}

let things : [number, number][] = [];

function find_ratios_recursive_silliness0(ratio: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  let error = Math.abs(ratio - target_gear_range);
  if(error < error_limit) {
    things.push([min_wheel_teeth, min_pinion_teeth]);
    //let line = format("Good gear ratio found: ratio {0} +/- {1}", ratio, error);
    //console.log(line);
    //addLineToOutput(line);
  }
}

function find_ratios_recursive(ratio: number, levels: number, min_wheel_teeth: number, min_pinion_teeth: number, max_teeth: number) {
  if(levels < 1) {
    let error = Math.abs(ratio - target_gear_range);
    if(error < error_limit) {
      let line = format("Good gear ratio found: ratio {0} +/- {1}", ratio, error);
      addLineToOutput(line);
    }
  } else {
    for(let wheel1 = min_wheel_teeth; wheel1 < max_teeth + 1; wheel1++) {
      for(let pinion1 = min_pinion_teeth; pinion1 < max_teeth + 1; pinion1++) {
        let ratio1 = (wheel1/pinion1);
        find_ratios_recursive(ratio1 * ratio, levels-1, wheel1, pinion1, max_teeth);
      }
    }
  }
}

function find_ratios_explicit_loops2(min_teeth: number, max_teeth: number) {
  for(let wheel1 = min_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);
      for(let wheel2 = wheel1; wheel2 < max_teeth + 1; wheel2++) {
        for(let pinion2 = pinion1; pinion2 < max_teeth + 1; pinion2++) {
          let gear_ratio = ratio1 * (wheel2/pinion2);
          let error = Math.abs(gear_ratio - target_gear_range);
          if(error < error_limit) {
            let line = format("Good gear ratio found: ({0},{1},{2},{3}), ratio {4} +/- {5}", wheel1, pinion1, wheel2, pinion2, gear_ratio, error);
            addLineToOutput(line);
          }
        }
      }
    }
  }
}


function find_ratios_explicit_loops3(min_teeth: number, max_teeth: number) {
  for(let wheel1 = min_teeth; wheel1 < max_teeth + 1; wheel1++) {
    for(let pinion1 = min_teeth; pinion1 < max_teeth + 1; pinion1++) {
      let ratio1 = (wheel1/pinion1);

      for(let wheel2 = wheel1; wheel2 < max_teeth + 1; wheel2++) {
        for(let pinion2 = pinion1; pinion2 < max_teeth + 1; pinion2++) {
          let ratio2 = ratio1 * (wheel2 / pinion2);


          for(let wheel3 = wheel2; wheel3 < max_teeth + 1; wheel3++) {
            for(let pinion3 = pinion2; pinion3 < max_teeth + 1; pinion3++) {

              let gear_ratio = ratio2 * (wheel3/pinion3);
              let error = Math.abs(gear_ratio - target_gear_range);
              if(error < error_limit) {
                let line = format("Good gear ratio found: ({0},{1},{2},{3}), ratio {4} +/- {5}", wheel1, pinion1, wheel2, pinion2, gear_ratio, error);
                //addLineToOutput(line);
                console.log(line);
              }
            }
          }
        }
      }
    }
  }
}

async function run() {
  clearOutput();
  let t1 = Date.now();
  //find_ratios_explicit_loops2(5, 100);
  //find_ratios_recursive(1, 3, 5, 5, 100);
  await find_ratios_recursive_silliness3(1, 5, 5, 100);
  let t2 = Date.now();


  //let t1b = Date.now();
  //find_ratios_explicit_loops3(5, 100);
  //find_ratios_recursive_silliness3(1, 5, 5, 100);
  //let t2b = Date.now();

  console.log(t2 - t1);
  //console.log(t2b - t1b);
}
