import re

from util import *

def replace_if_tags(html, metadata):
	logger.debug(f"Replacing if tags")

	ifs = r'\{\*\s*if\s*\(([^)]*)\)\s*\*\}([\s\S]*?)\{\*\s*ifend\s*\*\}'

	while re.search(ifs, html):
		match = re.search(ifs, html)

		if_condition = match.group(1)
		if_content = match.group(2)
		if_statement = match.string[match.start():match.end()]

		# Compose the statement for evaluation from the if_condition variable
		statement = ""
		for if_c in if_condition.split("&&"):
			if_c = if_c.strip()
			if if_c[0] == "!":
				statement += f"not '{if_c[1:]}' in globals()"
			else:
				statement += f"'{if_c}' in globals()"
			
			statement += " and "
		
		statement = statement[:-5]

		if eval(statement, metadata) == True:
			html = html.replace(if_statement, if_content)
		else:
			html = html.replace(if_statement, "")

	return html