using System;
using System.Diagnostics;
using Gtk;
using PeterO.Numbers;

namespace AstrogearsGUI
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			Application.Init ();
			MainWindow win = new MainWindow ();
			win.Show ();
			Run ();
			Application.Run ();
		}

		public static void Run() {
			var t = new Stopwatch ();
			var rs = new RunState (0, 1.002737909350795, 0.000003);
			t.Start ();
			Astrogears.FindRatios1(1, 5, 500, rs);
			t.Stop ();
			Console.WriteLine ("Found {0} results in {1} seconds", rs.Results.Count, t.ElapsedMilliseconds / 1000.0);
			foreach (var r in rs.Results) {
				Console.WriteLine (r);
			}
		}
	}

}
