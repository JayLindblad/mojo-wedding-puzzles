import logging
import sys
import json

SITE = "_site"
BASE = "base"
GAMES = "games"
LAYOUT = "layouts"
ASSETS = "assets"
FONTS = "fonts"
SCRIPTS = "scripts"
STYLES = "styles"

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def configure_logger():
	handler = logging.StreamHandler(sys.stdout)
	handler.setLevel(logging.INFO)
	formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
	handler.setFormatter(formatter)
	logger.addHandler(handler)

	return

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