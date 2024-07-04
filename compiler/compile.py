import os
import shutil

from util import *
import layouter

def composite_page(src, dst, metadata={}):
	logger.info(f"Compositing page {src} and writing to {dst}")
	page = layouter.apply_template(
		read_page(src),
		extra_metadata=metadata
	)
	write_page(page, dst)

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
	# Create site scaffolding
	setup_folder()

	# Add base page elements
	create_site()

	# Loop over folders in /games/ and create each one
	for item in os.listdir(GAMES):
		if not os.path.isfile(os.path.join(GAMES, item)):
			create_game(item)
	
if __name__ == "__main__":
	# Setup logging to console
	configure_logger()

	main()