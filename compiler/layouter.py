import copy
import re
import os

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
		metadata = metadata_match.group(1).strip()
		html = html_match.group(1).strip()

		# parse the metadata
		metadata = parse_metadata(metadata)

		return metadata, html
	else:
		return None, None

def replace_file_tags(html, prefix=""):
	logger.debug(f"Replacing file tags")

	file_tag_pattern = r'{%\s*(\S+)\s*%}'
	
	while re.search(file_tag_pattern, html):
		match = re.search(file_tag_pattern, html)
		if match:
			filename = match.group(1)
			
			if os.path.exists(filename):
				with open(filename, "r", encoding="utf-8") as file:
					file_content = file.read()
				html = html.replace(match.group(0), "\n" + file_content + "\n")
			else:
				html = html.replace(match.group(0), f'<!-- File {filename} not found -->')
				
	return html

def replace_games(layout):
	games = []
	for item in os.listdir(GAMES):
		if not os.path.isfile(os.path.join(GAMES, item)):
			games += [read_json(os.path.join(GAMES, item, "metadata.json"))]

	game_tags = r'{#\s*(\S+)\s*#}'

	while re.search(game_tags, layout):
		match = re.search(game_tags, layout)
		games_type = match.group(1)

		if games_type == "games":
			games_html = ""
			for item in games:
				games_html += '<div class="game-item">\n'
				
				games_html += '<div class="game-title">\n'
				games_html += f'<a href="/{item["slug"]}/play.html"><img src="{item["icon"]}"/></a>\n'
				games_html += f'<a href="/{item["slug"]}/play.html">{item["name"]}</a>\n'
				games_html += f'</div>\n'

				games_html += '<div class="game-links">\n'
				games_html += f'<a class="button" href="/{item["slug"]}/play.html">Spielen</a>\n'
				games_html += f'<a class="button" href="/{item["slug"]}/all.html">Alle</a>\n'
				games_html += f'</div>\n'
				games_html += f'</div>'

			layout = layout.replace(match.group(0), "\n" + games_html + "\n")
		
		elif games_type == "games-small":
			games_html = ""
			for item in games:
				games_html += f'<div id="{item["slug"]}" class="side-list-item side-list-game">\n'
				games_html += f'<a href="/{item["slug"]}/play.html"><img src="{item["icon"]}"/></a>\n'
				games_html += f'<a href="/{item["slug"]}/play.html">{item["name"]}</a>\n'
				games_html += f'</div>'

			layout = layout.replace(match.group(0), "\n" + games_html + "\n")

	return layout

def replace_if_tags(html, metadata):
	logger.debug(f"Replacing if tags")

	ifs = r'\{\*\s*if\s*\(([^)]*)\)\s*\*\}([\s\S]*?)\{\*\s*ifend\s*\*\}'

	while re.search(ifs, html):
		match = re.search(ifs, html)
		if_condition = match.group(1)

		if_content = match.group(2)
		whole = match.string[match.start():match.end()]

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
			html = html.replace(whole, if_content)
		else:
			html = html.replace(whole, "")

	return html

def apply_template(page, extra_metadata={}):
	logger.debug("Applying template to page")

	# read in page and parse it
	metadata, html = extract_metadata(page)
	metadata.update(extra_metadata)

	# read in layout
	layout = read_page(os.path.join(BASE, LAYOUT, metadata["layout"]))
	layout_metadata, _ = extract_metadata(layout)
	if layout_metadata:
		# Apply template to the layout if it has metadata
		layout = apply_template(layout)

	# replace {- content -} by the page 
	layout = layout.replace("{- content -}", "\n" + html + "\n")

	# replace layout vars by metadata
	for key, value in metadata.items():
		layout = layout.replace('{{ ' + key + ' }}', value)

	# replace {% xxx %} by the pages in the layout
	layout = replace_file_tags(layout)

	# replace {% xxx %} by the pages on the base page
	layout = replace_file_tags(layout)

	# replace # loop tags
	layout = replace_games(layout)

	# replace if tags
	layout = replace_if_tags(layout, copy.deepcopy(metadata))

	# replace layout vars by metadata
	for key, value in metadata.items():
		layout = layout.replace('{{ ' + key + ' }}', value)

	return layout