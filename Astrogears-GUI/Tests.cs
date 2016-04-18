using NUnit.Framework;
using System;
using PeterO.Numbers;

namespace AstrogearsGUI
{
	[TestFixture ()]
	public class NUnitTestClass
	{
		[Test ()]
		public void TrivialTestCase ()
		{
			Assert.IsTrue (true);
		}


		[Test ()]
		public void MathComparisonTest ()
		{
			var r = new ERational (142342, 432);
			var f = EFloat.FromString ("1.5", null);
			Console.WriteLine ("{0}, {1}", r, f);
			Assert.IsTrue (r.CompareToBinary(f) > 0);
		}
	}
}

