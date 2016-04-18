
let target_gear_range = 1.002737909350795
let error_limit = 0.000003


let find_ratios_explicit_loops2 (min_teeth:int) (max_teeth:int) =
    async {
        for wheel1 in min_teeth..max_teeth+1 do
            for wheel2 in min_teeth..max_teeth+1 do
                for pinion1 in min_teeth..max_teeth+1 do
                    for pinion2 in min_teeth..max_teeth+1 do
                        let wheel1d = double wheel1
                        let wheel2d = double wheel2
                        let pinion1d = double pinion1
                        let pinion2d = double pinion2

                        let gear_ratio = (wheel1d/pinion1d) * (wheel2d/pinion2d)
                        let error = abs (gear_ratio - target_gear_range)
                        if error < error_limit then
                            yield sprintf "Good gear ratio found: (%A,%A,%A,%A), ratio %A +/- %A\n" wheel1 pinion1 wheel2 pinion2 gear_ratio error
                            //printf "Good gear ratio found: (%A,%A,%A,%A), ratio %A +/- %A\n" wheel1 pinion1 wheel2 pinion2 gear_ratio error
    }

for x in find_ratios_explicit_loops2 5 100 do
    printf "%s" x
