import re

from util import *

def parse_metadata(metadata):
	logger.debug(f"Parsing metadata")

	items = {}
	for line in metadata.split('\n'):
		if ':' in line:
			key, value = line.split(':', 1)
			items[key.strip()] = value.strip()

	return items

def extract_metadata(page):
	logger.debug(f"Extracting metadata information")

	# Use regular expressions to extract the metadata and HTML parts
	metadata_pattern = r'---\n(.*?)\n---'
	html_pattern = r'---\n.*?\n---\n(.*)'
	
	metadata_match = re.search(metadata_pattern, page, re.DOTALL)
	html_match = re.search(html_pattern, page, re.DOTALL)
	
	if metadata_match and html_match:
		# get the strings
		metadata = metadata_match.group(1).strip()
		html = html_match.group(1).strip()

		# parse the metadata
		metadata = parse_metadata(metadata)

		return metadata, html
	else:
		return None, None