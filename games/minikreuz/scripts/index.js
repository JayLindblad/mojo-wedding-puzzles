let data = {};
let success = true;
let mistakes = 0;

let ended = false;
let started = Date.now();
let timeDiff = 0;
let showedComplete = false;

let previousSelected = -1;
let selectOrientation = "horizontal";

function initialiseGrid() {
	let grid = document.getElementById("grid");

	for (let y = 0; y < data.puzzle.size.y; y++) {
		let row = document.createElement("div");
		row.classList.add("row");
		row.id = "row" + y.toString();

		for (let x = 0; x < data.puzzle.size.x; x++) {
			let tile = document.createElement("div");
			tile.classList.add("tile");
			tile.classList.add("none");
			tile.id = "tile" + (y * data.puzzle.size.y + x).toString();

			row.appendChild(tile);
		};

		grid.appendChild(row);
	};
};

function populateGrid() {
	for (const [_, word] of data.puzzle.horizontal.entries()) {
		// Set letters
		for (const [index, letter] of word.word.split("").entries()) {
			let tileNumber = word.y * data.puzzle.size.y + (word.x + index);
			createInput(tileNumber, letter);
		};

		// set number
		let tileNumber = word.y * data.puzzle.size.y + word.x;
		let startTile = document.getElementById("tile" + tileNumber);

		let number = document.createElement("div");
		number.classList.add("puzzle-number");
		number.innerHTML = word.n;
		
		startTile.appendChild(number);
	};

	for (const [_, word] of data.puzzle.vertical.entries()) {
		// Set letters
		for (const [index, letter] of word.word.split("").entries()) {
			let tileNumber = (word.y + index) * data.puzzle.size.x + word.x;
			createInput(tileNumber, letter);
		};

		// set number
		let tileNumber = word.y * data.puzzle.size.y + word.x;
		let startTile = document.getElementById("tile" + tileNumber);
		
		if (startTile.childNodes[0].nodeName == "INPUT") {
			let number = document.createElement("div");
			number.classList.add("puzzle-number");
			number.innerHTML = word.n;
	
			startTile.appendChild(number);
		};
	};
};

async function initialisePuzzle() {
	//data = await puzzleLoadEvent();
	data = {
		"puzzle": {
			"vertical": [
				{
					"word": "pjs",
					"clue": "Attire you might wear while working from home, for short",
					"y": 1,
					"x": 0,
					"n": 4
				},
				{
					"y": 0,
					"word": "saute",
					"clue": "Pan fry",
					"x": 1,
					"n": 1
				},
				{
					"n": 2,
					"word": "aries",
					"x": 2,
					"y": 0,
					"clue": "Ram in the zodiac"
				},
				{
					"word": "dices",
					"x": 3,
					"y": 0,
					"clue": "Cuts into small cubes",
					"n": 3
				},
				{
					"clue": "Spanish verb meaning 'to be'",
					"n": 5,
					"word": "ser",
					"x": 4,
					"y": 1
				}
			],
			"horizontal": [
				{
					"clue": "In need of some cheering up",
					"n": 1,
					"word": "sad",
					"y": 0,
					"x": 1
				},
				{
					"clue": "City that holds an annual 'Grand Prix de la baguette' contest",
					"x": 0,
					"n": 4,
					"word": "paris",
					"y": 1
				},
				{
					"x": 0,
					"clue": "Battery life, colloquially",
					"y": 2,
					"word": "juice",
					"n": 6
				},
				{
					"word": "steer",
					"x": 0,
					"clue": "Take the wheel",
					"n": 7,
					"y": 3
				},
				{
					"n": 8,
					"clue": "Twice-curved letter",
					"x": 1,
					"word": "ess",
					"y": 4
				}
			],
			"size": {
				"x": 5,
				"y": 5
			}
		},
		"metadata": {
			"author": "Niklas",
			"timestamp": 1718151360078,
			"id": "5COMJWr3dvjPvfUmuGbS"
		}
	}

	// initialise game
	initialiseGrid();
	populateGrid();

	// highlight initial word
	let tileNumber = document.querySelector(".tile:not(.none)").id.substring(4);
	let word = getWord(tileNumber, selectOrientation);
	highlightWord(word);

	// select first input
	previousSelected = data.puzzle.horizontal[0].x + data.puzzle.horizontal[0].y * data.puzzle.size.y;
	focusInput();

	// populate letters with stored
	loadLetters();

	// Create listeners
	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.addEventListener('click', onTileClick);
		input.addEventListener('keydown', onTileInput);
	});
	
	// Create timer
	window.setInterval(() => { 
		localStorage.setItem(data.metadata.id + "_started", started);
		timeDiff = Date.now() - started;
		document.getElementById("timer").innerHTML = "Timer: " + getResults();
	}, 1000);

	// Load state
	loadState();
};

document.addEventListener('DOMContentLoaded', (event) => {
	// Once DOM loaded, run initialise
	initialisePuzzle();
});