import re
import os

from util import *
from parsers.variables import *

def replace_file_tags(html, metadata):
	logger.debug(f"Replacing file tags")

	file_tag_pattern = r'{%\s*(\S+)\s*%}'
	
	while re.search(file_tag_pattern, html):
		match = re.search(file_tag_pattern, html)
		if match:
			filename = match.group(1)

			# replace {{ slug }} by game name for relative file paths
			filename = replace_variables(filename, metadata)

			if os.path.exists(filename):
				with open(filename, "r", encoding="utf-8") as file:
					file_content = file.read()
				html = html.replace(match.group(0), "\n" + file_content + "\n")
			else:
				html = html.replace(match.group(0), f'<!-- File {filename} not found -->')
				
	return html