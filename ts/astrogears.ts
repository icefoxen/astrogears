// See https://github.com/iriscouch/bigdecimal.js

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
};

function clearOutput() {
   let e = document.getElementById("output");
   e.innerHTML = "";

}
function addLineToOutput(line:string) {
   let x = new function() {
      let e = document.getElementById("output");
      e.innerHTML += "<p>" + line + "</p>";
   }

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

function find_ratios_explicit_loops2(min_teeth: number, max_teeth: number) {
   for(let wheel1 = min_teeth; wheel1 < max_teeth + 1; wheel1++) {
      for(let wheel2 = wheel1; wheel2 < max_teeth + 1; wheel2++) {
         for(let pinion1 = min_teeth; pinion1 < max_teeth + 1; pinion1++) {
            for(let pinion2 = pinion1; pinion2 < max_teeth + 1; pinion2++) {
               let gear_ratio = (wheel1/pinion1) * (wheel2/pinion2);
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

function run() {
   clearOutput();
   find_ratios_explicit_loops2(5, 100);
}
