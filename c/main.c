
/*
def find_ratios_explicit_loops2(min_teeth, max_teeth):
    gears = range(min_teeth, max_teeth+1)
    for wheel1 in gears:
        for wheel2 in gears:
            for pinion1 in gears:
                for pinion2 in gears:
                    gear_ratio = (wheel1/pinion1) * (wheel2/pinion2)
                    error = abs(gear_ratio - target_gear_range)
                    ratios = (wheel1, pinion1, wheel2, pinion2)
                    if error < error_limit:
                        print("Good gear ratio found: {}, ratio {} +/- {}".format(ratios, gear_ratio, error))
*/

#include <stdio.h>
#include <math.h>
const double target_gear_range = 1.002737909350795;
const double error_limit = .000003;

void find_ratios_explicit_loops2(int min_teeth, int max_teeth) {
   for(int wheel1 = min_teeth; wheel1 < max_teeth + 1; wheel1++) {
      for(int wheel2 = min_teeth; wheel2 < max_teeth + 1; wheel2++) {
	 for(int pinion1 = min_teeth; pinion1 < max_teeth + 1; pinion1++) {
	    for(int pinion2 = min_teeth; pinion2 < max_teeth + 1; pinion2++) {
	       double wheel1d = wheel1;
	       double wheel2d = wheel2;
	       double pinion1d = pinion1;
	       double pinion2d = pinion2;
	       double gear_ratio = (wheel1d/pinion1d) * (wheel2d/pinion2d);
	       double error = fabs(gear_ratio - target_gear_range);
	       if(error < error_limit) {
		  printf("Good gear ratio found: (%d,%d,%d,%d), ratio %.12f +/- %.12f\n", wheel1, pinion1, wheel2, pinion2, gear_ratio, error);
	       }
	    }
	 }
      }
   }
}

int main() {
   find_ratios_explicit_loops2(5, 100);
}
