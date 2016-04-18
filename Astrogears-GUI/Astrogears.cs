using System;
using System.Text;
using System.Collections.Generic;

namespace AstrogearsGUI
{
	public class Result {
		public int[] Wheels;
		public int[] Pinions;
		public double Ratio;
		public double Error;

		public Result(int gearTrainLength, double ratio, double error) {
			Wheels = new int[gearTrainLength];
			Pinions = new int[gearTrainLength];
			Ratio = ratio;
			Error = error;
		}

		public override string ToString() {
			var sb = new StringBuilder ();
			sb.Append ("Wheel/pinion ");
			for (var i = 0; i < Wheels.Length; i++) {
				sb.AppendFormat ("{0}/{1} ", Wheels[i], Pinions[i]);
			}
			sb.AppendFormat (" Gear ratio: {0}, Error {1}", Ratio, Error);
			return sb.ToString ();
		}
	}

	public class RunState {
		public double Target;
		public double Error;
		public List<Result> Results;

		public RunState(int gearsize, double target, double error) {
			this.Target = target;
			this.Error = error;
			this.Results = new List<Result> ();
		}

		public void AddResult(Result r) {
			Results.Add (r);
		}
	}

	public static class Astrogears
	{
		public static void FindRatios1(double ratio, int minTeeth, int maxTeeth, RunState state) {
			for (int wheel = minTeeth; wheel <= maxTeeth; wheel++) {
				for (int pinion = minTeeth; pinion <= maxTeeth; pinion++) {
					var r = (double)wheel / (double)pinion;
					var result = ratio * r;
					var error = Math.Abs(state.Target - result);
					if (error < state.Error) {
						var theResult = new Result(0, result, error);
						state.AddResult (theResult);
					}
				}
			}
		}
	}
}

