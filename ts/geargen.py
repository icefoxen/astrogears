#!/usr/bin/env python3

# Since we have no Lisp macros, I am going to write a bit of
# code to generate a Typescript function with loops nested
# N deep.

def generate_body(level):
	actual_math = """
let result = {gearProduct};
let error = Math.abs(result - target_number);
if(error < target_error) {{
	let gearArray: number[] = {gearArray};
	let r = new Result(gearArray, target_number);
	results.push(r);
}}
	"""
	gears = ["gear{}".format(gear) for gear in range(1,level)]
	gearArray = "[" + (','.join(gears)) + ']'
	gearPairs = zip(gears[::2], gears[1::2])
	gearQuotients = ["({} / {})".format(g1, g2) for (g1, g2) in gearPairs]
	gearProduct = " * ".join(gearQuotients)
	return actual_math.format(gearProduct=gearProduct,
		gearArray=gearArray)

def generate_loops(desired_depth, delay_target, current_depth=1):
	forloop = \
"""{indent}for(let gear{n} = min_teeth; gear{n} <= max_teeth; gear{n}++) {{
{indent}	{delay}
{body}
{indent}}}"""

	if current_depth <= desired_depth:
		bodytext = generate_loops(desired_depth, delay_target,
		current_depth=current_depth+1)
		indent = "\t" * current_depth
		delay = ""
		if current_depth == delay_target:
			delay = "await updateStatus(gear1, results);"
		return forloop.format(
			n=current_depth, delay=delay,
			body=bodytext, indent=indent)
	else:
		return generate_body(current_depth)


def generate_function(depth):
	template = """
async function find_ratios{depth}(min_teeth: number, max_teeth: number, target_number: number, target_error: number) {{
	let results: Result[] = [];
	{generated_loops}
	return results;
}}
	"""
	return template.format(depth=depth, generated_loops=generate_loops(depth, 5))

print(generate_function(5))