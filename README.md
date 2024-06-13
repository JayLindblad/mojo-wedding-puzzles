the basic site provides:
 - the database functionality
	- loads the json that is the current game
	- adding and managing games
	- navigating between games
	- basic js and css for styling the navbar etc...
	- compilation to _site
	- how to play button that loads from the game
	- results modal that pops up

	- index.html as a welcome page for the site, showing all the games that are accessible

every game supports:
 - end event (gives back errors / stats -> shared end function that logs to logsnag/firebase + results function that gets the results)
 - add event (adding a game in json format -> shared add function that sends to appropriate firebase db)

 - index.html (play the actual game)
 - add.html (adding a new game)
	 - custom css/js for the game
 - how.html

site:
 - index.html (fetches all game types from firebase)
 - games/
	- {{ game.name }}
		- play.html
		- add.html
		- how.html
		- results.html
		- metadata.json
 - layouts/
	- play.html/?game_id=xxx&number=yyy
	- add.html/?game_id=xxx
	- all.html/?game_id=xxx

compiler:
 - creates _site
	 - copies index.html to the _site folder and create a button for each game with description and little icon
	 - copy styles and scripts to assets folder in site
	 - composites the head and navbar for each page

 - goes through each folder in the games/ directory
	 - creates the index, add pages with the how and results composited in (from default layout)
	 - adds the metadata to the pages head
	 - copies js and css to assets folder