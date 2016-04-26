#!/usr/bin/env python3

# Since we have no Lisp macros, I am going to write a bit of
# code to generate a Typescript function with loops nested
# N deep.

template = """
async function find_ratios{depth}(min_teeth: number, max_teeth: number, target_number: number, target_error: number) {{
	let results: Result[] = [];
	{generated_loops}
	return results;
}}
"""

def generate_loops(depth, indent_depth=1):
	forloop = """
{indent}for(let gear{n} = min_teeth; gear{n} <= max_teeth; gear{n}++) {{
{indent}	{body}
{indent}}}
	"""
	if depth == 0:
		return "Foobaz!"
	else:
		bodytext = generate_loops(depth-1, indent_depth+1)
		indent = "\t" * indent_depth
		return forloop.format(n=depth, body=bodytext, indent=indent)

print(template.format(depth=1, generated_loops="foo"))
print(generate_loops(9))