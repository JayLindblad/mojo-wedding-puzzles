import re
import os

from util import *

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