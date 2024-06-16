import logging
import sys
import os
import shutil
import re
import json
import copy

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

SITE = "_site"
BASE = "base"
GAMES = "games"
LAYOUT = "layouts"
ASSETS = "assets"
FONTS = "fonts"
SCRIPTS = "scripts"
STYLES = "styles"

def read_json(src):
	logger.debug(f"Reading json {src}")
	data = ""
	with open(src, "r") as file:
		data = json.load(file)
	return data

def read_page(src):
	logger.debug(f"Reading page {src}")
	page = ""
	with open(src, "r") as file:
		page = file.read()
	return page

def write_page(page, dst):
	logger.debug(f"Writing file to {dst}")
	with open(dst, "w") as file:
		file.write(page)

def extract_layout_info(page):
	logger.debug(f"Extracting layout information")
	# Use regular expressions to extract the metadata and HTML parts
	metadata_pattern = r'---\n(.*?)\n---'
	html_pattern = r'---\n.*?\n---\n(.*)'
	
	metadata_match = re.search(metadata_pattern, page, re.DOTALL)
	html_match = re.search(html_pattern, page, re.DOTALL)
	
	if metadata_match and html_match:
		metadata = metadata_match.group(1).strip()
		html = html_match.group(1).strip()
		return metadata, html
	else:
		return None, None
	
def parse_metadata(metadata):
	logger.debug(f"Parsing metadata")
	items = {}
	for line in metadata.split('\n'):
		if ':' in line:
			key, value = line.split(':', 1)
			items[key.strip()] = value.strip()
	return items

def replace_file_tags(html):
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

def replace_game_tags(folder, html):
	logger.debug(f"Replacing game tags")
	file_tag_pattern = r'{!\s*(\S+)\s*!}'
	
	while re.search(file_tag_pattern, html):
		match = re.search(file_tag_pattern, html)
		if match:
			filename = match.group(1)
			with open(os.path.join(GAMES, folder, filename), "r", encoding="utf-8") as file:
				file_content = file.read()
			html = html.replace(match.group(0), "\n" + file_content + "\n")

	return html

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

def composite_page(src, dst, metadata={}):
	logger.info(f"Compositing page {src} and writing to {dst}")
	page = apply_template(
		read_page(src),
		extra_metadata=metadata
	)
	write_page(page, dst)

def apply_template(page, extra_metadata={}):
	logger.debug("Applying template to page")

	# read in page and parse it
	metadata, html = extract_layout_info(page)

	# parse metadata
	metadata = parse_metadata(metadata)

	# read in layout
	layout = read_page(os.path.join(BASE, LAYOUT, metadata["layout"]))
	layout_metadata, layout_html = extract_layout_info(layout)
	if layout_metadata:
		layout_metadata = parse_metadata(layout_metadata)
		layout = apply_template(
			layout
		)

	# replace {% xxx %} by the pages in the layout
	layout = replace_file_tags(layout)

	# replace {! xxx !} by the game's files
	if "slug" in extra_metadata:
		layout = replace_game_tags(extra_metadata["slug"], layout)

	# replace {% xxx %} by the pages on the base page
	html = replace_file_tags(html)

	# replace {% content %} by the page 
	layout = layout.replace("{- content -}", "\n" + html + "\n")

	# replace # loop tags
	layout = replace_games(layout)

	# replace if tags
	layout = replace_if_tags(layout, copy.deepcopy(metadata))

	# replace layout vars by metadata
	for key, value in metadata.items():
		layout = layout.replace('{{ ' + key + ' }}', value)

	for key, value in extra_metadata.items():
		layout = layout.replace('{{ ' + key + ' }}', value)

	return layout

def setup_folder():
	# Create _site folder
	logger.info("Start creating the site scaffolding")

	# delete old _site folder
	logger.debug("Delete old _site folder")
	if os.path.exists(os.path.join(SITE)) and os.path.isdir(os.path.join(SITE)):
		shutil.rmtree(os.path.join(SITE))

	# create new one
	logger.debug("Create new site folder (_site, assets, scripts, styles)")
	os.mkdir(os.path.join(SITE))
	os.mkdir(os.path.join(SITE, ASSETS))
	os.mkdir(os.path.join(SITE, ASSETS, SCRIPTS))
	os.mkdir(os.path.join(SITE, ASSETS, STYLES))

def create_site():
	# Copy over the basic scripts and styles
	logger.info("Creating base site in _site directory")

	logger.debug("Create asset and style folder in _site for base site")
	shutil.copytree(
		os.path.join(BASE, SCRIPTS),
		os.path.join(SITE, ASSETS, SCRIPTS),
		dirs_exist_ok=True
	)
	shutil.copytree(
		os.path.join(BASE, STYLES),
		os.path.join(SITE, ASSETS, STYLES),
		dirs_exist_ok=True
	)
	shutil.copytree(
		os.path.join(BASE, FONTS),
		os.path.join(SITE, ASSETS, FONTS),
		dirs_exist_ok=True
	)

	# copy over 404.html page
	shutil.copy(
		os.path.join(BASE, "404.html"),
		os.path.join(SITE, "404.html")
	)

	# Composite the index.html pages
	composite_page(
		os.path.join(BASE, "index.html"),
		os.path.join(SITE, "index.html")
	)

	# add the keys to the db.js script
	keys = read_page("./.env")
	script = read_page(os.path.join(SITE, ASSETS, SCRIPTS, "db.js"))
	write_page(keys + "\n" + script, os.path.join(SITE, ASSETS, SCRIPTS, "db.js"))

def create_game(folder):
	logger.info(f"Creating files for game: {folder}")

	# Copying the assets
	os.mkdir(os.path.join(SITE, folder))
	os.mkdir(os.path.join(SITE, ASSETS, folder))
	os.mkdir(os.path.join(SITE, ASSETS, folder, SCRIPTS))
	os.mkdir(os.path.join(SITE, ASSETS, folder, STYLES))
	shutil.copytree(
		os.path.join(GAMES, folder, STYLES),
		os.path.join(SITE, ASSETS, folder, STYLES),
		dirs_exist_ok=True
	)
	shutil.copytree(
		os.path.join(GAMES, folder, SCRIPTS),
		os.path.join(SITE, ASSETS, folder, SCRIPTS),
		dirs_exist_ok=True
	)

	metadata = read_json(os.path.join(GAMES, folder, "metadata.json"))
	metadata["slug"] = folder
	
	# create the all.html file
	composite_page(
		os.path.join(GAMES, folder, "all.html"),
		os.path.join(SITE, folder, "all.html"),
		metadata
	)

	# Create the play.html file
	composite_page(
		os.path.join(GAMES, folder, "play.html"),
		os.path.join(SITE, folder, "play.html"),
		metadata
	)

	# Create the add.html file
	composite_page(
		os.path.join(GAMES, folder, "add.html"),
		os.path.join(SITE, folder, "add.html"),
		metadata
	)

def main():
	handler = logging.StreamHandler(sys.stdout)
	handler.setLevel(logging.INFO)
	formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
	handler.setFormatter(formatter)
	logger.addHandler(handler)
	
	# Create site scaffolding
	setup_folder()

	# Add base page elements
	create_site()

	# Loop over folders in /games/ and create each one
	for item in os.listdir(GAMES):
		if not os.path.isfile(os.path.join(GAMES, item)):
			create_game(item)
	  
main()