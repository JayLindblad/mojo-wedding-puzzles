import re

from util import *

def replace_variables(layout, metadata):
	for key, value in metadata.items():
		# search for {{key}} in layout
		expression = r"{{\s*" + key + r"\s*}}"
		match = re.search(expression, layout)

		# replace by variable
		if match:
			layout = layout.replace(match.group(0), value)

	return layout