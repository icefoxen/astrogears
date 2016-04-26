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

print(template.format(depth=1, generated_loops="foo"))