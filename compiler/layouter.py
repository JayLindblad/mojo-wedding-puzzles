import copy
import re
import os

from util import *
from parsers.metadata import *
from parsers.conditionals import *
from parsers.loops import *
from parsers.variables import *
from parsers.files import *

def apply_template(page, extra_metadata={}):
	logger.debug("Applying template to page")

	# read in page and parse it
	metadata, html = extract_metadata(page)

	# remove extra_metadata.layout before adding
	if "layout" in extra_metadata:
		del extra_metadata["layout"]
	# Add extra_metadata for templating
	metadata.update(extra_metadata)

	# read in layout
	layout = read_page(os.path.join(BASE, LAYOUT, metadata["layout"]))
	layout_metadata, _ = extract_metadata(layout)

	# If the page specifies a layout, apply it
	if layout_metadata and "layout" in layout_metadata:
		layout = apply_template(layout, metadata)

	# Apply the templating engine
	logger.debug("Templating the composed page...")

	# replace {- content -} by the page
	layout = layout.replace("{- content -}", "\n" + html + "\n")

	# replace {% xxx %} by the pages in the layout
	layout = replace_file_tags(layout, metadata)

	# replace # loop tags
	layout = replace_games(layout)

	# replace if tags
	layout = replace_if_tags(layout, copy.deepcopy(metadata))

	# replace layout vars by metadata
	layout = replace_variables(layout, metadata)

	return layout