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
	};

	for (const [_, word] of data.puzzle.vertical.entries()) {
		// Set letters
		for (const [index, letter] of word.word.split("").entries()) {
			let tileNumber = (word.y + index) * data.puzzle.size.x + word.x;
			createInput(tileNumber, letter);
		};
	};
};

async function initialisePuzzle() {
	//data = await puzzleLoadEvent();
	data = {
		"puzzle": {
			"horizontal": [
				{
					"word": "sad",
					"y": 0,
					"n": 1,
					"clue": "In need of some cheering up",
					"x": 1
				},
				{
					"y": 1,
					"x": 0,
					"n": 4,
					"word": "paris",
					"clue": "City that holds an annual 'Grand Prix de la baguette' contest"
				},
				{
					"word": "ju",
					"y": 2,
					"n": 6,
					"x": 0,
					"clue": "Battery life, colloquially"
				},
				{
					"word": "steer",
					"n": 7,
					"clue": "Take the wheel",
					"x": 0,
					"y": 3
				},
				{
					"y": 4,
					"word": "ess",
					"n": 8,
					"x": 1,
					"clue": "Twice-curved letter"
				}
			],
			"size": {
				"y": 5,
				"x": 5
			},
			"vertical": [
				{
					"n": 4,
					"word": "pjs",
					"y": 1,
					"x": 0,
					"clue": "Attire you might wear while working from home, for short"
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
					"word": "ar",
					"x": 2,
					"y": 0,
					"clue": "Ram in the zodiac"
				},
				{
					"clue": "Cuts into small cubes",
					"n": 3,
					"y": 0,
					"x": 3,
					"word": "dices"
				},
				{
					"x": 4,
					"n": 5,
					"y": 1,
					"word": "ser",
					"clue": "Spanish verb meaning 'to be'"
				}
			]
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
	let tileNumber = document.querySelector(".tile:not(.none)").childNodes[0].attributes.tilenumber.value;
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