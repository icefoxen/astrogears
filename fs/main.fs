open System
open System.Collections.Generic
open System.Threading.Tasks

let target_gear_range = 1.002737909350795
let error_limit = 0.000003


let find_ratios_explicit_loops2 (min_teeth:int) (max_teeth:int) =
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
                        printf "Good gear ratio found: (%A,%A,%A,%A), ratio %A +/- %A\n" wheel1 pinion1 wheel2 pinion2 gear_ratio error

let find_ratios_explicit_loops2_tasks (min_teeth:int) (max_teeth:int) =
    let tasks = new List<Task>()
    for wheel1 in min_teeth..max_teeth+1 do
       let f () =
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
                        printf "Good gear ratio found: (%A,%A,%A,%A), ratio %A +/- %A\n" wheel1 pinion1 wheel2 pinion2 gear_ratio error
       let t = new Task(new Action(f))
       t.Start ()
       tasks.Add(t)
    tasks


let find_ratios_explicit_loops2_async (min_teeth:int) (max_teeth:int) = seq {
  yield async {
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
                        printf "Good gear ratio found: (%A,%A,%A,%A), ratio %A +/- %A\n" wheel1 pinion1 wheel2 pinion2 gear_ratio error
   }
  }


//find_ratios_explicit_loops2 5 100
//let tasks = find_ratios_explicit_loops2_tasks 5 150
//printf "Number of tasks: %d\n" (tasks.Count)
//Task.WaitAll(tasks.ToArray())

find_ratios_explicit_loops2_async 5 1-0 |>
Async.Parallel |>
Async.Ignore |>
Async.RunSynchronously

//find_ratios_explicit_loops2_async 5 150 |>
//Seq.map Async.StartAsTask |>
//Seq.map (fun x -> x.Wait()) |>
//printf "Foo? %A\n"
