const target_gear_range: number = 1.002737909350795;
const error_limit: number = .000003;



function find_ratios_explicit_loops2(min_teeth: number, max_teeth: number) {
   for(let wheel1 = min_teeth; wheel1 < max_teeth + 1; wheel1++) {
      for(let wheel2 = min_teeth; wheel2 < max_teeth + 1; wheel2++) {
         for(let pinion1 = min_teeth; pinion1 < max_teeth + 1; pinion1++) {
            for(let pinion2 = min_teeth; pinion2 < max_teeth + 1; pinion2++) {
               let gear_ratio = (wheel1/pinion1) * (wheel2/pinion2);
               let error = Math.abs(gear_ratio - target_gear_range);
               if(error < error_limit) {
                  console.log("Good gear ratio found: (%d,%d,%d,%d), ratio %.12f +/- %.12f", wheel1, pinion1, wheel2, pinion2, gear_ratio, error);
               }
            }
         }
      }
   }
}


function f() {
   let thunk = function() {find_ratios_explicit_loops2(5, 100)};
   setInterval(thunk, 0);
}
