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
		public int MinTeeth;
		public int MaxTeeth;
		public List<Result> Results;

		public RunState(int gearsize, double target, double error, int minTeeth, int maxTeeth) {
			this.Target = target;
			this.Error = error;
			this.Results = new List<Result> ();
			this.MinTeeth = minTeeth;
			this.MaxTeeth = maxTeeth;
		}

		public void AddResult(Result r) {
			Results.Add (r);
		}
	}

	public static class Astrogears
	{
		public static void FindRatiosContN(double ratio, RunState state, int n) {
			var conts = new ContinuationThing[n];
			for (int i = 0; i < n - 1; i++) {
				conts [i] = FindRatiosContN;
			}
			conts [n - 1] = FindRatiosCont1;
			FindRatiosContN (ratio, state, conts, 0);
		}
		delegate void ContinuationThing(double ratio, RunState state, ContinuationThing[] conts, int n);
		static void FindRatiosContN(double ratio, RunState state, ContinuationThing[] conts, int n) {
			var cont = conts [n];
			for(var wheel = state.MinTeeth; wheel <= state.MaxTeeth; wheel++) {
				//Console.WriteLine ("Working on wheel {0}, level {1}", wheel, n);
				for (var pinion = state.MinTeeth; pinion <= state.MaxTeeth; pinion++) {
					var result = ratio * ((double)wheel / (double)pinion);
					cont (result, state, conts, n + 1);
				}
			}
		}

		static void FindRatiosCont1(double ratio, RunState state, ContinuationThing[] conts, int n) {
			for(var wheel = state.MinTeeth; wheel <= state.MaxTeeth; wheel++) {
				for (var pinion = state.MinTeeth; pinion <= state.MaxTeeth; pinion++) {
					var result = ratio * ((double)wheel / (double)pinion);
					var error = Math.Abs(state.Target - result);
					//Console.WriteLine ("Argl, {0}, {1}", state.MinTeeth, state.MaxTeeth);
					//Console.WriteLine ("Foobaz? {0} {1} {2}", state.Target, result, error);
					if (error < state.Error) {
						var theResult = new Result(0, result, error);
						state.AddResult (theResult);
					}
				}
			}
		}

		public static void FindRatios2(double ratio, int minTeeth, int maxTeeth, RunState state) {
			for (int wheel = minTeeth; wheel <= maxTeeth; wheel++) {
				for (int pinion = minTeeth; pinion <= maxTeeth; pinion++) {
					var r = (double)wheel / (double)pinion;
					var result = ratio * r;
					FindRatios1 (result, minTeeth, maxTeeth, state);
				}
			}
		}
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

